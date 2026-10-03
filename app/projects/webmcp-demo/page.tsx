import { Suspense, lazy } from 'react'
import type { Metadata } from 'next'
import { LoadingSpinner } from '../../components/loading-spinner'

export const metadata: Metadata = {
  title: 'WebMCP + Gemini Nano Demo',
  description:
    "A one-off demo pairing Chrome's on-device Gemini Nano model with WebMCP, the emerging browser standard for exposing page tools to AI agents.",
}

const WebMcpDemoPlayer = lazy(() =>
  import('../../components/webmcp_demo/webmcp_demo_player').then((mod) => ({
    default: mod.WebMcpDemoPlayer,
  }))
)

export default function WebMcpDemoPage(): JSX.Element {
  return (
    <section>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-3">
          WebMCP + Gemini Nano Demo
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          This page registers a couple of small tools (fetch a bio, fetch
          contact info) via the experimental{' '}
          <a
            href="https://developer.chrome.com/docs/ai/webmcp"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-color underline"
          >
            WebMCP
          </a>{' '}
          browser standard, and uses Chrome&apos;s on-device{' '}
          <a
            href="https://developer.chrome.com/docs/ai/prompt-api"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-color underline"
          >
            Gemini Nano
          </a>{' '}
          model as the agent that decides which tool to call. Both are
          experimental and flag-gated in Chrome today — this is a proof of
          concept, not a production feature.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="flex items-center justify-center p-12 bg-card border border-slate-200 dark:border-slate-700 rounded-lg">
            <div className="flex flex-col items-center space-y-4">
              <LoadingSpinner size="lg" />
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Loading demo…
              </p>
            </div>
          </div>
        }
      >
        <WebMcpDemoPlayer />
      </Suspense>
    </section>
  )
}
