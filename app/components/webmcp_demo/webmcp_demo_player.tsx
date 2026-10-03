'use client'

import { useEffect, useState } from 'react'
import { demoTools } from './demo-tools'
import {
  checkNanoAvailability,
  getWebMcpSnapshot,
  hasWebMcp,
  registerWebMcpTools,
  runToolLoop,
  type NanoAvailability,
  type ToolLoopStep,
  type WebMcpToolSnapshot,
} from './webmcp_demo'

const SAMPLE_QUESTIONS = [
  "What's James's background?",
  'How do I get in touch with James?',
]

export function WebMcpDemoPlayer(): JSX.Element {
  const [availability, setAvailability] = useState<NanoAvailability | null>(
    null
  )
  const [webMcpAvailable, setWebMcpAvailable] = useState(false)
  const [webMcpSnapshot, setWebMcpSnapshot] = useState<
    WebMcpToolSnapshot[] | null
  >(null)
  const [question, setQuestion] = useState(SAMPLE_QUESTIONS[0] ?? '')
  const [running, setRunning] = useState(false)
  const [steps, setSteps] = useState<ToolLoopStep[]>([])
  const [finalAnswer, setFinalAnswer] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [simulated, setSimulated] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    checkNanoAvailability().then((result) => {
      if (!cancelled) setAvailability(result)
    })
    if (hasWebMcp()) {
      registerWebMcpTools()
      setWebMcpAvailable(true)
      getWebMcpSnapshot().then((snapshot) => {
        if (!cancelled) setWebMcpSnapshot(snapshot)
      })
    }
    return () => {
      cancelled = true
    }
  }, [])

  const nanoUsable = availability === 'available'

  async function handleRun(e: React.FormEvent) {
    e.preventDefault()
    if (!question.trim() || running) return
    setRunning(true)
    setError(null)
    setFinalAnswer(null)
    setSteps([])
    try {
      const result = await runToolLoop(question.trim())
      setSteps(result.steps)
      setFinalAnswer(result.final)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setRunning(false)
    }
  }

  function handleSimulate() {
    const tool = demoTools[0]
    if (!tool) return
    setSimulated(tool.execute({}))
  }

  if (availability === null) {
    return (
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Checking for on-device AI support…
      </p>
    )
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-4 text-sm">
        <p className="font-medium text-slate-900 dark:text-slate-100 mb-1">
          Status
        </p>
        <ul className="space-y-1 text-slate-600 dark:text-slate-400">
          <li>
            Gemini Nano (Prompt API): <strong>{availability}</strong>
            {availability === 'downloadable' && (
              <span>
                {' '}
                — requires ~20GB free disk to start the one-time ~4GB download.
              </span>
            )}
          </li>
          <li>
            WebMCP (<code>document.modelContext</code>):{' '}
            <strong>{webMcpAvailable ? 'available' : 'not available'}</strong>
            {!webMcpAvailable && (
              <span>
                {' '}
                — enable <code>chrome://flags/#enable-webmcp-testing</code> in
                Chrome Canary to see it registered here.
              </span>
            )}
          </li>
        </ul>
      </div>

      {webMcpSnapshot && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-4 text-sm">
          <p className="font-medium text-slate-900 dark:text-slate-100 mb-2">
            Tools registered via <code>document.modelContext</code>
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
            Open DevTools console on this page and try:{' '}
            <code>await document.modelContext.getTools()</code>
          </p>
          <ul className="space-y-1">
            {webMcpSnapshot.map((tool) => (
              <li
                key={tool.name}
                className="text-slate-600 dark:text-slate-400"
              >
                <code>{tool.name}</code> — {tool.description}
              </li>
            ))}
          </ul>
        </div>
      )}

      {nanoUsable ? (
        <form
          onSubmit={handleRun}
          className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-4 space-y-3"
        >
          <label
            htmlFor="webmcp-demo-question"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Ask the on-device agent
          </label>
          <input
            id="webmcp-demo-question"
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
          <div className="flex flex-wrap gap-2">
            {SAMPLE_QUESTIONS.map((sample) => (
              <button
                key={sample}
                type="button"
                onClick={() => setQuestion(sample)}
                className="text-xs px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary-color"
              >
                {sample}
              </button>
            ))}
          </div>
          <button
            type="submit"
            disabled={running || !question.trim()}
            className="rounded-lg bg-primary-color px-3 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {running ? 'Running…' : 'Run'}
          </button>

          {error && (
            <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
          )}

          {steps.length > 0 && (
            <ol className="space-y-2 text-sm border-t border-slate-200 dark:border-slate-700 pt-3">
              {steps.map((step, i) => (
                <li key={i}>
                  <span className="font-medium text-slate-900 dark:text-slate-100">
                    {step.label}:
                  </span>{' '}
                  <span className="text-slate-600 dark:text-slate-400">
                    {step.detail}
                  </span>
                </li>
              ))}
            </ol>
          )}

          {finalAnswer && (
            <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 p-3 text-sm text-slate-900 dark:text-slate-100">
              {finalAnswer}
            </div>
          )}
        </form>
      ) : (
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-4 space-y-3 text-sm">
          <p className="text-slate-600 dark:text-slate-400">
            Gemini Nano isn&apos;t available in this browser, so the
            tool-calling loop can&apos;t run live here. You can still see one
            tool execute directly, with no model involved:
          </p>
          <button
            type="button"
            onClick={handleSimulate}
            className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:border-primary-color"
          >
            Simulate get_bio()
          </button>
          {simulated && (
            <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 p-3 text-slate-900 dark:text-slate-100">
              {simulated}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
