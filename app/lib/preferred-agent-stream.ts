// Routing wrapper for the global chat widget: prefers the visitor's own
// on-device Gemini Nano model over the Bedrock backend whenever it's
// already available, purely to avoid paying for a Bedrock call the
// visitor's browser could answer for free. Never triggers the ~4GB model
// download itself — that's only ever started from an explicit user click
// (see downloadNanoModel in nano-chat.ts).
//
// Must be a provable no-op when Nano is unavailable: that's the path
// essentially all traffic hits until Nano reaches stable Chrome.

import { streamAgentReply, type StreamAgentOptions } from './agent-stream'
import {
  getNanoAvailability,
  streamNanoReply,
  NanoStreamError,
} from './nano-chat'

export interface PreferredStreamOptions extends StreamAgentOptions {
  onProviderResolved?: (provider: 'gemini-nano' | 'bedrock') => void
}

export async function streamPreferredReply(
  opts: PreferredStreamOptions
): Promise<void> {
  const { onProviderResolved, ...rest } = opts

  const availability = await getNanoAvailability().catch(
    () => 'unavailable' as const
  )

  if (availability === 'available') {
    try {
      onProviderResolved?.('gemini-nano')
      await streamNanoReply({
        prompt: rest.prompt,
        signal: rest.signal,
        onDelta: rest.onDelta,
      })
      return
    } catch (err) {
      // Only fall back silently if nothing was shown yet — once Nano has
      // started answering, a silent retry via Bedrock would duplicate or
      // garble the response.
      if (err instanceof NanoStreamError && err.partiallyStreamed) {
        throw err
      }
    }
  }

  onProviderResolved?.('bedrock')
  await streamAgentReply(rest)
}
