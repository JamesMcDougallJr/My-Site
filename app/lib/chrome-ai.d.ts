// Ambient types for experimental Chrome APIs used by the WebMCP + Gemini
// Nano demo and the on-device chat provider. Neither is in lib.dom.d.ts as
// of this writing (Chrome 146 era) — this is a minimal hand-written stub,
// not a generated type-fest, and should be corrected against a live Chrome
// DevTools console session rather than trusted blindly.
//
// KNOWN AMBIGUITY: public docs disagree on the exact availability() enum
// values across Chrome versions — some show
// 'readily-available' | 'after-download' | 'downloading' | 'unavailable',
// others show 'available' | 'downloadable' | 'downloading' | 'unavailable'.
// This file uses the latter (newer) spelling; if the installed Chrome build
// reports the former, update NanoAvailability-consuming code together with
// this file.

type LanguageModelAvailability =
  | 'unavailable'
  | 'downloadable'
  | 'downloading'
  | 'available'

interface LanguageModelExpectedContent {
  type: 'text' | 'audio' | 'image'
}

interface LanguageModelDownloadProgressEvent {
  loaded: number
}

interface LanguageModelCreateMonitor {
  addEventListener(
    type: 'downloadprogress',
    listener: (event: LanguageModelDownloadProgressEvent) => void
  ): void
}

interface LanguageModelInitialPrompt {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface LanguageModelCreateOptions {
  expectedInputs?: LanguageModelExpectedContent[]
  expectedOutputs?: LanguageModelExpectedContent[]
  initialPrompts?: LanguageModelInitialPrompt[]
  signal?: AbortSignal
  monitor?: (monitor: LanguageModelCreateMonitor) => void
}

interface LanguageModelPromptOptions {
  responseConstraint?: object
  signal?: AbortSignal
}

interface LanguageModelSession {
  prompt(input: string, options?: LanguageModelPromptOptions): Promise<string>
  promptStreaming(
    input: string,
    options?: LanguageModelPromptOptions
  ): AsyncIterable<string>
  destroy(): void
  readonly inputUsage?: number
  readonly inputQuota?: number
}

interface LanguageModelStatic {
  availability(
    options?: LanguageModelCreateOptions
  ): Promise<LanguageModelAvailability>
  create(options?: LanguageModelCreateOptions): Promise<LanguageModelSession>
}

declare const LanguageModel: LanguageModelStatic | undefined

// WebMCP (document.modelContext) — W3C Web Machine Learning CG draft,
// Chrome 146+ behind chrome://flags/#enable-webmcp-testing.
interface ModelContextToolAnnotations {
  readOnlyHint?: boolean
  consequentialHint?: boolean
  untrustedContentHint?: boolean
  debugging?: boolean
}

interface ModelContextTool {
  name: string
  description: string
  inputSchema: object
  annotations?: ModelContextToolAnnotations
  execute: (
    args: Record<string, unknown>,
    context?: { signal?: AbortSignal }
  ) => Promise<unknown> | unknown
}

interface ModelContextApi {
  registerTool(tool: ModelContextTool): void | Promise<void>
  getTools(): ModelContextTool[] | Promise<ModelContextTool[]>
  executeTool(
    tool: ModelContextTool | string,
    args: Record<string, unknown>,
    options?: { signal?: AbortSignal }
  ): Promise<unknown>
}

interface Document {
  modelContext?: ModelContextApi
}
