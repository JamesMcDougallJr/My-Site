export type AgentType = 'prompt-driven' | 'automated'
export type AgentProvider = 'gemini-nano' | 'bedrock' | 'openai'

export interface AgentProviderOption {
  id: AgentProvider
  name: string
  requiresApiKey: boolean
}

export type AgentKind = 'chat'

export interface Agent {
  slug: string
  name: string
  description: string
  type: AgentType
  status: 'Active' | 'Beta' | 'Archived'
  invokePath: string
  providers: AgentProviderOption[]
  kind: AgentKind
}

export const agents: Agent[] = [
  {
    slug: 'site-qa',
    name: 'Site Q&A',
    description:
      "Ask about James's tutoring, AI consulting, background, or how to get in touch.",
    type: 'prompt-driven',
    status: 'Active',
    invokePath: '/agent/invocations',
    providers: [
      {
        id: 'gemini-nano',
        name: 'On-device AI (Gemini Nano)',
        requiresApiKey: false,
      },
      { id: 'bedrock', name: 'Bedrock', requiresApiKey: false },
      {
        id: 'openai',
        name: 'OpenAI (bring your own key)',
        requiresApiKey: true,
      },
    ],
    kind: 'chat',
  },
]

export function getAgent(slug: string): Agent | undefined {
  return agents.find((a) => a.slug === slug)
}
