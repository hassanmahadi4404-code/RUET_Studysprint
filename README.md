# StudySprint

> An AI-powered study companion that turns course materials into clear explanations, study plans, quizzes, and useful YouTube resources.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?logo=vercel)](https://ruet-studysprint-v2.vercel.app/)

## Live Demo

Visit **[ruet-studysprint.vercel.app](https://ruet-studysprint-v2.vercel.app/)**.

## About the Project

RUET students often study from scattered PDFs, lecture notes, slides, and videos. It can be difficult to decide what to study next or where to find a simple explanation.

StudySprint brings these tasks into one workspace. A student can upload a course file or paste notes, then use AI to understand, plan, and practise the material.

## Main Features

- **Ask your notes:** Get a simple answer based on the selected course material.
- **Study plan:** Generate a focused exam-preparation plan for up to 14 days.
- **Practice quiz:** Create five MCQs with answers and explanations.
- **YouTube resources:** Receive useful English, Bangla, and problem-solving search links.
- **File upload:** Use PDF, TXT, or Markdown files up to 4 MB.
- **Paste notes:** Add text directly without uploading a file.
- **Two languages:** Choose Bengali or English responses.
- **Demo mode:** Try the included Operating Systems notes without an API key.

## How It Works

1. Select the built-in sample, upload a course file, or paste your notes.
2. Choose **Ask**, **Plan**, or **Quiz**.
3. StudySprint sends the material and request to Gemini through a server-side API route.
4. The result is checked against a structured schema and displayed in the workspace.
5. Relevant YouTube search links are generated for further learning.

## Technology Used

- [Next.js](https://nextjs.org/) App Router
- [React](https://react.dev/) and TypeScript
- [Vercel AI SDK](https://ai-sdk.dev/)
- Google Gemini
- [Zod](https://zod.dev/) for response validation
- Lucide React icons
- Vercel for deployment

No database or external file storage is required.

## Run Locally

### Requirements

- Node.js 20 or newer
- [pnpm](https://pnpm.io/)
- A Google Gemini API key for custom materials

### Installation

```bash
git clone <your-repository-url>
cd ruet-studysprint
pnpm install
cp .env.example .env.local
```

Add your Gemini API key to `.env.local`:

```env
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_studio_key
GEMINI_MODEL=gemini-3.6-flash
```

Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> [!IMPORTANT]
> Never commit `.env.local` or share your API key publicly. If a key is exposed, rotate it immediately.

## Available Commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start the development server |
| `pnpm build` | Create a production build |
| `pnpm start` | Run the production build |
| `pnpm lint` | Check code quality |
| `pnpm typecheck` | Check TypeScript types |

## Project Structure

```text
ruet-studysprint/
├── app/
│   ├── api/generate/route.ts   # Gemini API route
│   ├── globals.css             # Application styles
│   ├── layout.tsx              # Root layout and metadata
│   └── page.tsx                # Home page
├── components/
│   └── study-sprint-app.tsx    # Main interactive workspace
├── lib/
│   ├── demo-data.ts            # Demo responses
│   ├── sample-material.ts      # Built-in course notes
│   ├── types.ts                # Shared TypeScript types
│   └── youtube.ts              # YouTube search-link generator
├── .env.example                # Environment variable example
└── package.json
```

## Deploy to Vercel

1. Push the project to GitHub.
2. Import the repository at [vercel.com/new](https://vercel.com/new).
3. Add `GOOGLE_GENERATIVE_AI_API_KEY` in **Project Settings → Environment Variables**.
4. Optionally add `GEMINI_MODEL`; otherwise the app uses `gemini-3.6-flash`.
5. Click **Deploy**.

## Privacy and Safety

- The Gemini API key is used only on the server and is not sent to the browser.
- This app does not use a database or permanently store uploaded materials.
- File type and size are validated before processing.
- AI is instructed to answer only from the supplied course material.
- YouTube search links are generated instead of inventing direct video URLs.
- AI responses are validated before they are shown in the interface.

## Verification

Before submitting or deploying changes, run:

```bash
pnpm typecheck
pnpm lint
pnpm build
```

## Hackathon

StudySprint was created for the **Reimagine Learning at RUET** challenge to make exam preparation clearer, faster, and more practical for students.
