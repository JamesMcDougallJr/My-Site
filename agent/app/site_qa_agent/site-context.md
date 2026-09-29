## Home (/)

# James McDougall
Building AI for Defense, Business & Education
I'm a software engineer in the defense industry building AI-powered solutions. Beyond my work in defense, I help small businesses integrate AI into their workflows in practical ways, and tutor students in computer science, history, and English—developing well-rounded critical thinkers ready to make an impact.
AI for BusinessPractical AI integration for small businessesBook a call → (https://calendly.com/jamesimcdougalljr/30min)TutoringComputer Science, History & EnglishLearn more → (/tutoring)
## Recent Posts
ENABLE WEBCAM
Jan 23, 2026This Past Century: ThesesTheses are just guesses with extra stepsRead more → (/blog/this-past-century-theses)
Jan 22, 2026This Past Century: IntroIntroduction to why I'm starting this periodical.Read more → (/blog/this-past-century-intro)
Jan 22, 2026Getting Started with Sanity CMSAn introduction to powering this blog with Sanity CMS, covering why it was chosen and what comes next.Read more → (/blog/getting-started-with-sanity-cms)

## Tutoring (/tutoring)

# Tutoring Services
I offer one-on-one and group tutoring sessions in Computer Science, History, and English for students from middle school through college. My approach is grounded in clear expectations and rigorous standards—not lowering the bar, but giving students the support they need to meet it.
Whether you're mastering programming fundamentals, analyzing historical events, or crafting compelling essays, I focus on developing the critical thinking and discipline that transfer across every area of life. In an era where AI is reshaping how we work and learn, students need to understand these tools thoughtfully—not just how to use them, but when to use them, and how to wield them responsibly. My goal is to prepare students to engage with the world as capable, ethical citizens who can make a meaningful impact.
## Meet Your Tutor
I'm James, a software engineer working in defense and AI. I bring real-world technical experience to every session, helping students connect what they're learning to how it's actually used in industry.
## Computer Science
Build a strong foundation in programming and software development. I focus on practical, hands-on learning with real-world projects.
### Topics Covered
Programming fundamentals
Data structures & algorithms
Web development
Python & JavaScript
Interview preparation
## History
Develop critical thinking and analytical skills through the study of historical events, movements, and primary sources.
### Topics Covered
World history
US history
Research methods
Essay writing
Primary source analysis
## English
Strengthen your writing and communication skills. From grammar basics to advanced literary analysis and persuasive writing.
### Topics Covered
Essay writing
Reading comprehension
Grammar & mechanics
Literature analysis
College application essays
## Ready to get started?
Book a free consultation to discuss your goals and how I can help.
Book a Session (https://calendly.com/jamesimcdougalljr/30min)

## Projects (/projects)

# Projects
SmollamaActiveDistributed LLM coordination for resource-constrained devicesPythonFastAPISQLiteOllamaVector Embeddings+4 moreExplore → (/projects/smollama)

## Smollama | James McDougall (/projects/smollama)

# Smollama
Active
Distributed LLM coordination for resource-constrained devices
View on GitHub (https://github.com/JamesMcDougallJr/smollama)
## Overview
Smollama is a distributed AI agent system designed for resource-constrained devices like Raspberry Pi. It enables nodes to sense their environment through GPIO sensors and system metrics, remember observations with semantic search, think using local LLMs via Ollama, communicate with other nodes over MQTT, and sync data using conflict-free replicated data types (CRDTs) for seamless offline-first operation.
## Key Features
### Sense
Read GPIO sensors, system metrics, and environmental data from connected hardware.
### Remember
Store observations and memories in SQLite with vector embeddings for semantic search.
### Think
Process events using local LLMs via Ollama with a tool-based reasoning loop.
### Communicate
Share state with other nodes via MQTT for distributed coordination.
### Sync
Operate offline and merge data deterministically using append-only CRDT logs with Lamport timestamps.
### Dashboard
FastAPI web interface with HTMX for live monitoring and interaction.
## Tech Stack
### Core
PythonFastAPISQLite
### AI & ML
OllamaVector Embeddings
### Infrastructure
MQTTCRDTsRaspberry Pi
### Testing
pytest

## This Past Century: Theses | James McDougall (/blog/this-past-century-theses)

# This Past Century: Theses
January 23, 2026
The Great Man Theory of history was popularized in 19th Century. As the name suggests, the theory proposes in its most extreme argument that all of history is shaped and explained by great men - heroes and villains alike. While it has come under much criticism, I think it hits on a few key truths.
It is much easier to remember just the great men of history. To be fair, history is long and complicated - and by default we want to summarize large swaths of knowledge into stories - and great men help us develop a mental model. Almost no one other than a trained historian could you off the top of your head when Cyrus the great ruled, and the key aspects of that period of history. Its much easier to understand the impacts of one man, and tie to him the surrounding effects of history.
Of course, that was then, and this is now. Knowledge can be stored digitally; we no longer rely on the spoken or hand-written word to transfer this knowledge about the past, so our abstractions regarding it can change. I really can ask google or an AI engine about the entire history of the middle east B.C., and understand the nuances of how other forces shaped history.
As the Great Man theory has fallen out of fashion, plenty of other theories have filled its place. Of course, there were also other theories competing at the time as well. I'm not even sure "theory" is an appropriate term to apply to history - history isn't a scientific process, really. I think these are more so lenses through which we must choose to view our own history. Insert joke about how all of history is propaganda here....
My "theory", the Great Invention lens of history, is really just my attempt to force some kind of organization to what I'm doing here. I do think it bears some weight though. In history classes we frequently teach about the impact of advances in farming, division of labor, etc. But the past hundred years have been defined by invention, perhaps more than any other age. One does wonder if things only feel like they're moving faster because of a modernity bias - since we're always in the present, well then the present must be the most advanced time! The difference in the past hundred years is perhaps that the technology we've invented has given us the ability to understand and organize information about the past much more easily. We've invented labor saving devices not just for the body, but for the mind as well.
So that's the theory. It might evolve as a I do more research. I'm going to focus on the impacts of inventions on history. Since its only a hundred years, I'll have less to digest between each invention. And yet, each invention could have even greater impact.

## This Past Century: Intro | James McDougall (/blog/this-past-century-intro)

# This Past Century: Intro
January 22, 2026
One of the first things I did when I got my first iPod touch was pull up the podcast app. At that point in my life (early teens), I was held back from what I now consider my "true self" by social anxiety and awkwardness. I kept to myself, because I was afraid of being embarrassed or ostracized. I realize now that a lot of it was in my own head... but eh, who cares about that. The point is this: I isolated myself, and podcasts were my safe space.
Specifically, history podcasts... Maybe other teenagers employ other methods of finding comfort, but the soothing noises of Mike Duncan's "History of Rome" or Dan Carlin's "Hardcore History" put me to sleep most nights for a while there. As a result I came into high school knowing an awful lot about specific historical facts and trends. I was really annoying to my high school history teachers.
Fast forward 10ish years, and I'm a software engineer. I think there are a lot of things to learn between history and engineering, mostly related to understanding trends and how dynamic, unpredictable forces actually produce outcomes quite predictably.
I'm in a stable enough place in my life where I want to get back to basics. And with LLMs taking over software development, it got me thinking about the importance of tokens. Creating them, uniquely, creatively, and with gusto. An LLM can generate tokens, including assortments that appear somewhat unique. But all LLMs are trained on things such as this article. Or a history textbook. But we are quickly running out of genuinely new information, or old information processed with modern sensibilities. My fear is that if we lose writing, and the love of it, we may no longer be in the drivers seat when it comes to AI.
All that being said, I'm starting this to put my own spin on the last 100 (more like 150) years - specifically, to see what my take on it is. I specifically want to understand the evolution of modern technology, which has accelerated so much so quickly, it almost seems to break trends with the rest of history as we understand it.
I would love to someday be able to publish some of this as a podcast - because I like yapping. For now, I will focus on writing and researching.
See you this century.
James

## Getting Started with Sanity CMS | James McDougall (/blog/getting-started-with-sanity-cms)

# Getting Started with Sanity CMS
January 22, 2026
# Getting Started with Sanity CMS
This blog is now powered by Sanity CMS, a modern headless content management system that provides a great authoring experience.
## Why Sanity?
Sanity offers several advantages:
Real-time collaboration - Multiple editors can work simultaneously
Portable Text - Rich text that's stored as structured data
Flexible schemas - Define your content model with code
Fast API - Global CDN ensures quick content delivery
## Next Steps
Now that the CMS is set up, I can focus on creating content instead of managing files. Stay tuned for more posts!
import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
export default defineConfig({
name: 'default',
title: 'My Sanity Blog',
projectId: 'yourProjectId',
dataset: 'production',
plugins: [deskTool()],
schema: {
types: [
{
name: 'post',
title: 'Post',
type: 'document',
fields: [
{ name: 'title', type: 'string', title: 'Title' },
{ name: 'slug', type: 'slug', title: 'Slug', options: { source: 'title' } },
{ name: 'summary', type: 'text', title: 'Summary' },
{ name: 'body', type: 'array', title: 'Body', of: [{ type: 'block' }] }
]
}
]
}
})

## Map (/map)

The "map" nav link redirects to an external interactive historical map tool hosted separately from this site; it is not on-site content.
