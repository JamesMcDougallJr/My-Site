import { demoTools, findDemoTool } from './demo-tools'

export type NanoAvailability =
  | 'no-api'
  | 'unavailable'
  | 'downloadable'
  | 'downloading'
  | 'available'

export function hasLanguageModel(): boolean {
  return typeof LanguageModel !== 'undefined'
}

export async function checkNanoAvailability(): Promise<NanoAvailability> {
  if (!hasLanguageModel()) return 'no-api'
  try {
    return await LanguageModel!.availability()
  } catch {
    return 'unavailable'
  }
}

export function hasWebMcp(): boolean {
  return typeof document !== 'undefined' && Boolean(document.modelContext)
}

// Registers the demo's tools with the real WebMCP API when present. No-ops
// silently otherwise — this is a parallel, best-effort registration, not the
// primary execution path used by runToolLoop below.
export function registerWebMcpTools(): void {
  if (!hasWebMcp()) return
  for (const tool of demoTools) {
    document.modelContext!.registerTool({
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema,
      annotations: { readOnlyHint: true },
      execute: async (args) => tool.execute(args),
    })
  }
}

export interface WebMcpToolSnapshot {
  name: string
  description: string
}

export async function getWebMcpSnapshot(): Promise<WebMcpToolSnapshot[] | null> {
  if (!hasWebMcp()) return null
  const tools = await document.modelContext!.getTools()
  return tools.map((tool) => ({ name: tool.name, description: tool.description }))
}

const TOOL_NAMES = demoTools.map((tool) => tool.name)

const SELECTION_SCHEMA = {
  type: 'object',
  properties: {
    tool: { type: 'string', enum: ['none', ...TOOL_NAMES] },
    answer: { type: 'string' },
  },
  required: ['tool', 'answer'],
  additionalProperties: false,
}

interface SelectionResult {
  tool: string
  answer: string
}

export interface ToolLoopStep {
  label: string
  detail: string
}

export interface ToolLoopResult {
  steps: ToolLoopStep[]
  final: string
}

function parseSelection(raw: string): SelectionResult {
  const parsed: unknown = JSON.parse(raw)
  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    typeof (parsed as Record<string, unknown>).tool !== 'string' ||
    typeof (parsed as Record<string, unknown>).answer !== 'string'
  ) {
    throw new Error('Model returned an unexpected shape for the tool selection.')
  }
  return parsed as SelectionResult
}

// Deliberately a single classify -> execute -> finalize pass (two prompt()
// calls, at most), not a multi-turn agent loop. A small on-device model has
// no confirmed multi-step tool-calling reliability, so this is the safe
// ceiling of complexity for a live demo.
export async function runToolLoop(question: string): Promise<ToolLoopResult> {
  if (!hasLanguageModel()) {
    throw new Error('The Prompt API is not available in this browser.')
  }

  const steps: ToolLoopStep[] = []
  const session = await LanguageModel!.create()

  try {
    const classifyPrompt = `You can answer directly, or call one tool if the user is asking about James's background or how to contact him.
Tools available: get_bio (no args) — a short bio. get_contact_info (no args) — contact methods.
If no tool is needed, set "tool" to "none" and put your full answer in "answer".
If a tool is needed, set "tool" to its name and leave "answer" as an empty string.
User question: ${question}`

    const selectionRaw = await session.prompt(classifyPrompt, {
      responseConstraint: SELECTION_SCHEMA,
    })
    const selection = parseSelection(selectionRaw)
    steps.push({
      label: 'Tool selection',
      detail: `tool: ${selection.tool}`,
    })

    if (selection.tool === 'none') {
      return { steps, final: selection.answer }
    }

    const tool = findDemoTool(selection.tool)
    if (!tool) {
      throw new Error(`Model selected an unknown tool: ${selection.tool}`)
    }

    const toolResult = tool.execute({})
    steps.push({ label: `Executed ${tool.name}`, detail: toolResult })

    const finalizePrompt = `Tool "${tool.name}" returned:\n${toolResult}\n\nUsing only this information, answer the user's question: ${question}`
    const final = await session.prompt(finalizePrompt)
    steps.push({ label: 'Final answer', detail: final })

    return { steps, final }
  } finally {
    session.destroy()
  }
}
