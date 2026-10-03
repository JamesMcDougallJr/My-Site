// Self-contained tool content for the WebMCP + Gemini Nano demo. Deliberately
// NOT wired to agent/app/site_qa_agent's markdown files — this is a one-off
// demo, not a port of the production Q&A agent's content.

export interface DemoTool {
  name: string
  description: string
  inputSchema: object
  execute: (args: Record<string, unknown>) => string
}

const BIO =
  'James McDougall Jr. is a software engineer in the defense industry building AI-powered solutions. Outside of that, he helps small businesses integrate AI into their workflows and tutors students in computer science, history, and English.'

const CONTACT_INFO =
  'Book a call: https://calendly.com/jamesimcdougalljr/30min\nEmail: jamesimcdougalljr@gmail.com'

export const demoTools: DemoTool[] = [
  {
    name: 'get_bio',
    description: 'Fetch a short bio of James McDougall Jr.',
    inputSchema: {
      type: 'object',
      properties: {},
      additionalProperties: false,
    },
    execute: () => BIO,
  },
  {
    name: 'get_contact_info',
    description: 'Fetch contact methods for James (booking link and email).',
    inputSchema: {
      type: 'object',
      properties: {},
      additionalProperties: false,
    },
    execute: () => CONTACT_INFO,
  },
]

export function findDemoTool(name: string): DemoTool | undefined {
  return demoTools.find((tool) => tool.name === name)
}
