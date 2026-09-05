# AI Workplace Productivity Assistant

A modern, responsive web application that helps professionals automate daily work tasks using AI. Built with **TanStack Start**, **React 19**, **TypeScript**, and **Tailwind CSS v4**, it delivers a polished SaaS-style experience with a Prism Glass visual direction.

## Features

- **Smart Email Generator** — Draft workplace emails by selecting tone, audience, length, and key points.
- **Meeting Notes Summarizer** — Turn raw notes or transcripts into decision-ready summaries with key points, action items, deadlines, and open questions.
- **AI Task Planner** — Prioritise and schedule tasks around working hours, with impact/urgency ranking and focus-time protection.
- **AI Research Assistant** — Produce concise briefings with insights, trade-offs, recommended next steps, and confidence notes.
- **AI Chatbot Interface** — Separate, browser-persisted conversations for open-ended workplace questions.

## Tech Stack

- **Framework:** [TanStack Start v1](https://tanstack.com/start) (full-stack React, SSR/SSG, file-based routing)
- **Build Tool:** [Vite 7](https://vitejs.dev)
- **UI:** React 19, Tailwind CSS v4, Radix UI primitives, [shadcn/ui](https://ui.shadcn.com) components
- **AI:** Lovable AI Gateway with `google/gemini-3.7-flash` via the AI SDK (`streamText`)
- **Server Functions:** `createServerFn` from `@tanstack/react-start`
- **Storage:** Browser `localStorage` for chat threads, tool history, and usage stats (no backend database required)
- **Icons:** Lucide React

## Project Structure

```
src/
  components/
    AppShell.tsx              # Responsive top navigation + Aurora/Prism Glass shell
    ToolWorkspace.tsx         # Shared layout for email, notes, planner, research
    ChatWorkspace.tsx         # Separate-conversation chat interface
    ai-elements/              # AI UI primitives (conversation, message, prompt-input, shimmer)
  lib/
    ai-gateway.server.ts      # Lovable AI Gateway provider setup
    ai.functions.ts           # Server functions for each productivity tool
    tool-prompts.ts           # Structured prompt engineering for all AI features
    local-store.ts            # Browser storage for history and chat threads
    utils.ts                  # Utility helpers
  routes/
    __root.tsx                # Root layout
    index.tsx                 # Dashboard
    email.tsx                 # Email generator
    notes.tsx                 # Meeting notes summariser
    planner.tsx               # Task planner
    research.tsx              # Research assistant
    chat.index.tsx            # Chat redirect / new conversation
    chat.$threadId.tsx        # Individual chat thread
    api/chat.ts               # Streaming chat API route
  styles.css                  # Design tokens, Prism Glass theme, animations
  start.ts                    # Start app configuration
  router.tsx                  # TanStack Router setup
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [Bun](https://bun.sh/) or npm
- A Lovable AI Gateway API key (`LOVABLE_API_KEY`)

### Install Dependencies

```sh
bun install
# or
npm install
```

### Run the Development Server

```sh
bun run dev
# or
npm run dev
```

The app will be available at `http://localhost:8080`.

### Environment Variables

Create a `.env` file in the project root if one does not exist:

```env
LOVABLE_API_KEY=your_lovable_api_key_here
```

`LOVABLE_API_KEY` is required for the AI-powered tools and chat to generate responses.

## Usage

1. Open the dashboard and choose a tool card.
2. Fill in the requested fields (tone, audience, raw notes, tasks, research question, etc.).
3. Click **Generate** to receive a structured AI output.
4. Copy results to your clipboard.
5. Visit **Chat** to start separate, saved conversations.

All tool outputs and chat threads are saved locally in your browser.

## Design

- **Visual direction:** Prism Glass — dark, structured panels with crisp borders, subtle depth, and calm surfaces.
- **Responsive:** Top navigation collapses into a mobile drawer on smaller screens.
- **Accessibility:** Semantic HTML, keyboard-friendly controls, and screen-reader-friendly labels.

## Disclaimer

AI-generated content may require human review. Always verify facts, dates, figures, and sensitive details before sending or acting on generated output.

## Deployment

This project is ready to deploy on Lovable or any platform that supports TanStack Start / Vite edge builds.

---

Built with [Lovable](https://lovable.dev).
