export interface ProjectFeature {
  title: string
  description: string
}

export interface TechItem {
  name: string
  category: 'core' | 'infrastructure' | 'ai' | 'testing'
}

export interface Project {
  slug: string
  title: string
  description: string
  overview: string
  features: ProjectFeature[]
  techStack: TechItem[]
  githubUrl: string
  liveUrl?: string
  status: 'Active' | 'Beta' | 'Archived'
}

export const projects: Project[] = [
  {
    slug: 'smollama',
    title: 'Smollama',
    description:
      'Distributed LLM coordination for resource-constrained devices',
    overview:
      'Smollama is a distributed AI agent system designed for resource-constrained devices like Raspberry Pi. It enables nodes to sense their environment through GPIO sensors and system metrics, remember observations with semantic search, think using local LLMs via Ollama, communicate with other nodes over MQTT, and sync data using conflict-free replicated data types (CRDTs) for seamless offline-first operation.',
    features: [
      {
        title: 'Sense',
        description:
          'Read GPIO sensors, system metrics, and environmental data from connected hardware.',
      },
      {
        title: 'Remember',
        description:
          'Store observations and memories in SQLite with vector embeddings for semantic search.',
      },
      {
        title: 'Think',
        description:
          'Process events using local LLMs via Ollama with a tool-based reasoning loop.',
      },
      {
        title: 'Communicate',
        description:
          'Share state with other nodes via MQTT for distributed coordination.',
      },
      {
        title: 'Sync',
        description:
          'Operate offline and merge data deterministically using append-only CRDT logs with Lamport timestamps.',
      },
      {
        title: 'Dashboard',
        description:
          'FastAPI web interface with HTMX for live monitoring and interaction.',
      },
    ],
    techStack: [
      { name: 'Python', category: 'core' },
      { name: 'FastAPI', category: 'core' },
      { name: 'SQLite', category: 'core' },
      { name: 'Ollama', category: 'ai' },
      { name: 'Vector Embeddings', category: 'ai' },
      { name: 'MQTT', category: 'infrastructure' },
      { name: 'CRDTs', category: 'infrastructure' },
      { name: 'Raspberry Pi', category: 'infrastructure' },
      { name: 'pytest', category: 'testing' },
    ],
    githubUrl: 'https://github.com/JamesMcDougallJr/smollama',
    status: 'Active',
  },
  {
    slug: 'historical-map',
    title: 'Historical Map',
    description:
      'Interactive dark-themed map exploring historical sites and markers across Utah',
    overview:
      'Historical Map is an interactive web map built with OpenLayers for exploring historical points of interest. It renders a dark-themed base layer from Stadia Maps with a vector layer of markers, letting visitors pan and zoom around Utah to discover the history behind specific locations.',
    features: [
      {
        title: 'Interactive Map',
        description:
          'Pan and zoom across a dark-themed OpenLayers map centered on Utah.',
      },
      {
        title: 'Historical Markers',
        description:
          'Vector layer of markers highlighting historical sites and points of interest.',
      },
      {
        title: 'Dark Tile Theme',
        description:
          'Stadia Maps dark tiles for a clean, legible map that fits a dark UI.',
      },
    ],
    techStack: [
      { name: 'TypeScript', category: 'core' },
      { name: 'Next.js', category: 'core' },
      { name: 'OpenLayers', category: 'core' },
      { name: 'Stadia Maps', category: 'infrastructure' },
      { name: 'Vercel', category: 'infrastructure' },
    ],
    githubUrl: 'https://github.com/JamesMcDougallJr/historical-map',
    liveUrl: 'https://historical-map-omega.vercel.app/map',
    status: 'Active',
  },
  {
    slug: 'webcam-object-detection',
    title: 'Webcam Object Detection',
    description:
      'Real-time object detection running client-side on your webcam feed',
    overview:
      'Webcam Object Detection is a browser-based demo that runs real-time object detection on a live webcam feed using MediaPipe Tasks Vision and an EfficientDet Lite0 model. All inference happens client-side, with GPU acceleration used when available, and detected objects are drawn as bounding box overlays directly on the video.',
    features: [
      {
        title: 'Live Webcam Feed',
        description:
          'Captures video directly from the browser and streams it through the detector.',
      },
      {
        title: 'Real-Time Detection',
        description:
          'Runs the EfficientDet Lite0 model on each frame to detect and classify objects.',
      },
      {
        title: 'Bounding Box Overlays',
        description:
          'Draws labeled bounding boxes over detected objects directly on the video element.',
      },
      {
        title: 'GPU Acceleration',
        description:
          'Uses GPU delegation when available for faster, smoother inference.',
      },
    ],
    techStack: [
      { name: 'TypeScript', category: 'core' },
      { name: 'React', category: 'core' },
      { name: 'Next.js', category: 'core' },
      { name: 'MediaPipe Tasks Vision', category: 'ai' },
      { name: 'EfficientDet Lite0', category: 'ai' },
    ],
    githubUrl: 'https://github.com/JamesMcDougallJr/portfolio-starter-kit',
    status: 'Active',
  },
]

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}
