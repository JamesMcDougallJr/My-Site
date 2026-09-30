// Client-side Gemini Nano (Chrome Prompt API) chat path — mirrors
// streamAgentReply's call shape so both chat surfaces can branch on
// provider without changing their try/catch/finally structure.
//
// Context parity: fetches the same three files the Bedrock agent builds its
// system prompt from (agent/app/site_qa_agent/{system-prompt,site-context,
// career-facts}.md, copied into public/agent-context/ by
// scripts/build-site-context.mjs) and does the same {{TODAY}}/{{SITE_CONTEXT}}
// /{{CAREER_FACTS}} substitution client-side, since the static build can be
// served long after it ran.

export type NanoAvailability =
  | 'no-api'
  | 'unavailable'
  | 'downloadable'
  | 'downloading'
  | 'available'

export interface NanoChatOptions {
  prompt: string
  signal: AbortSignal
  onDelta: (text: string) => void
}

export class NanoStreamError extends Error {
  // True if at least one onDelta call fired before this error — callers
  // must not silently retry via another provider once partial output has
  // already been shown, to avoid a duplicated/garbled answer.
  partiallyStreamed: boolean

  constructor(message: string, partiallyStreamed: boolean, cause?: unknown) {
    super(message)
    this.name = 'NanoStreamError'
    this.partiallyStreamed = partiallyStreamed
    this.cause = cause
  }
}

export function hasLanguageModel(): boolean {
  return typeof LanguageModel !== 'undefined'
}

export async function getNanoAvailability(): Promise<NanoAvailability> {
  if (!hasLanguageModel()) return 'no-api'
  try {
    return await LanguageModel!.availability()
  } catch {
    return 'unavailable'
  }
}

export async function downloadNanoModel(
  onProgress: (fraction: number) => void
): Promise<void> {
  if (!hasLanguageModel()) {
    throw new Error('The Prompt API is not available in this browser.')
  }
  const session = await LanguageModel!.create({
    monitor(monitor) {
      monitor.addEventListener('downloadprogress', (e) => {
        onProgress(e.loaded)
      })
    },
  })
  session.destroy()
}

let cachedContext: string | null = null

async function fetchContext(path: string): Promise<string> {
  const res = await fetch(path)
  if (!res.ok) {
    throw new Error(`Failed to fetch ${path}: ${res.status}`)
  }
  return res.text()
}

async function buildSystemPrompt(): Promise<string> {
  if (cachedContext) return cachedContext

  const [template, siteContext, careerFacts] = await Promise.all([
    fetchContext('/agent-context/system-prompt.md'),
    fetchContext('/agent-context/site-context.md'),
    fetchContext('/agent-context/career-facts.md'),
  ])

  cachedContext = template
    .replace('{{TODAY}}', new Date().toISOString().slice(0, 10))
    .replace('{{SITE_CONTEXT}}', siteContext)
    .replace('{{CAREER_FACTS}}', careerFacts)

  return cachedContext
}

let cachedSession: LanguageModelSession | null = null

async function getSession(): Promise<LanguageModelSession> {
  if (cachedSession) return cachedSession
  const systemPrompt = await buildSystemPrompt()
  cachedSession = await LanguageModel!.create({
    initialPrompts: [{ role: 'system', content: systemPrompt }],
  })
  return cachedSession
}

export async function streamNanoReply(opts: NanoChatOptions): Promise<void> {
  const { prompt, signal, onDelta } = opts

  if (!hasLanguageModel()) {
    throw new NanoStreamError(
      'The Prompt API is not available in this browser.',
      false
    )
  }

  let deltaEmitted = false
  let session: LanguageModelSession

  try {
    session = await getSession()
  } catch (err) {
    throw new NanoStreamError(
      'Failed to start an on-device model session.',
      false,
      err
    )
  }

  try {
    let previous = ''
    for await (const chunk of session.promptStreaming(prompt, { signal })) {
      // promptStreaming's chunk shape (incremental delta vs. cumulative
      // snapshot) is unconfirmed against the live Chrome build — diff
      // against the previous cumulative value so callers can always treat
      // onDelta as an incremental append, matching streamAgentReply.
      const delta = chunk.startsWith(previous)
        ? chunk.slice(previous.length)
        : chunk
      previous = chunk.startsWith(previous) ? chunk : previous + chunk
      if (delta) {
        deltaEmitted = true
        onDelta(delta)
      }
    }
  } catch (err) {
    throw new NanoStreamError(
      'The on-device model failed mid-response.',
      deltaEmitted,
      err
    )
  }
}
