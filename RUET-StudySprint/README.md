# RUET StudySprint

> Turn scattered course materials into grounded answers, a clear exam plan, active-recall quizzes, and targeted YouTube learning resources.

StudySprint is an AI study companion built for the **Reimagine Learning at RUET** challenge. A student uploads a PDF/TXT/Markdown file or pastes notes, then uses three focused tools:

- **Ask your notes** — course-grounded explanations with confidence and key exam points.
- **Study plan** — a 3, 7, or 14-day plan based on the important topics in the material.
- **Practice quiz** — interactive MCQs with explanations and weak-topic feedback.
- **YouTube resources** — targeted English, Bangla, and problem-solving searches for every relevant topic.

The app includes a built-in Operating Systems sample, so the complete interface works in demo mode without setup. Add a Gemini key to analyze personal material with Gemini 3.6 Flash.

## Why this matters

RUET students often study from fragmented slides, PDFs, notes, question banks, and videos. Finding the next useful action takes time. StudySprint turns one course source into a small, personalized workflow: **understand → plan → practice → repair weak topics**.

## Tech stack

- Next.js 16 App Router + React 19 + TypeScript
- Vercel AI SDK 7
- Google Generative AI provider
- Gemini 3.6 Flash
- Zod-validated structured AI output
- CSS-first responsive interface
- Lucide icons

No database or external storage is required.

## Run locally

Requirements: Node.js 20+ and pnpm.

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Open `http://localhost:3000`.

Create a **new** Google AI Studio key and put it in `.env.local`:

```env
GOOGLE_GENERATIVE_AI_API_KEY=your_new_key
GEMINI_MODEL=gemini-3.6-flash
```

Never commit `.env.local`. If a key was pasted into chat or shared publicly, rotate it before use.

## Deploy to Vercel

1. Push this folder to a public GitHub repository.
2. Import the repository at [vercel.com/new](https://vercel.com/new).
3. Add `GOOGLE_GENERATIVE_AI_API_KEY` under **Project Settings → Environment Variables**.
4. Deploy. Next.js is detected automatically.

No other infrastructure is needed.

## Safety and grounding

- Academic answers are instructed to use only the supplied material.
- Embedded instructions inside uploaded documents are treated as data.
- Uploaded files are validated by type and size (maximum 4 MB).
- The server never returns or exposes the Gemini key to the browser.
- AI returns YouTube **search queries**, and the server builds valid YouTube search URLs. This avoids hallucinated video IDs.
- Zod schemas validate every answer, plan, and quiz before it reaches the UI.

## Verification

```bash
pnpm typecheck
pnpm lint
pnpm build
```

## Project files

- `app/api/generate/route.ts` — Gemini and structured-generation backend
- `components/study-sprint-app.tsx` — complete interactive workspace
- `lib/sample-material.ts` — built-in demo course context
- `SUBMISSION.md` — ready-to-paste Devpost submission
- `DEMO_SCRIPT.md` — under-two-minute demo recording plan

Built during RUET Hack Day.
