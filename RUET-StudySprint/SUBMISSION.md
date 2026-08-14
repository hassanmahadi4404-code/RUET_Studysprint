# Devpost Submission — Ready to Paste

## Project Name

RUET StudySprint

## Tagline

Turn any course material into grounded answers, a clear exam plan, practice quizzes, and the right learning resources.

## Inspiration

RUET students do not suffer from a lack of content. We have slides, PDFs, class notes, question banks, group messages, and countless videos. The real problem is deciding what to study next, finding a trustworthy explanation, and checking whether we actually understood it. StudySprint was built to turn scattered material into one clear study workflow.

## What it does

A student uploads a course PDF/TXT/Markdown file or pastes notes. StudySprint then offers three focused experiences:

1. **Ask your notes** — explains a difficult concept using only the selected material, highlights exam-ready points, and states how strongly the material supports the answer.
2. **Study plan** — creates a realistic 3, 7, or 14-day route with priority topics, focused daily sessions, practice, and revision.
3. **Practice quiz** — generates conceptual MCQs with plausible distractors, instant explanations, scoring, and weak-topic feedback.

For every important or weak topic, StudySprint also creates three targeted YouTube resources: a simple English explanation, a Bangla tutorial, and problem-solving practice.

## How we built it

StudySprint is a Next.js App Router application written in React and TypeScript. The server sends the student's text or supported document directly to Gemini 3.6 Flash through the Vercel AI SDK and Google Generative AI provider. AI outputs are validated with Zod schemas before being displayed. The application does not require a database, which keeps it fast, private, and easy to deploy.

The responsive interface is designed as a focused course workspace rather than a generic chatbot. It includes drag-and-drop upload, pasted notes, bilingual responses, interactive quizzes, confidence indicators, material connections, and topic-level video resources.

## How Gemini is used

Gemini is the core reasoning layer, not an add-on. It reads multimodal course documents, identifies concepts and priorities, explains difficult topics, creates structured study schedules, writes balanced quiz questions, diagnoses weak areas, and creates precise YouTube search queries. Without Gemini, the product would only store files; with Gemini, the material becomes an active personal coach.

To reduce hallucination, Gemini is instructed to make academic claims only from the supplied course material. It never creates direct video IDs. Instead, it produces targeted search queries that the server converts to real YouTube search URLs.

## Challenges we ran into

- Designing one AI response format that is useful for very different course subjects.
- Keeping answers grounded while still making them simple and exam-focused.
- Returning reliable structured plans and quizzes from a language model.
- Providing useful external video help without inventing direct YouTube links.

We addressed these with strict system instructions, Zod-validated output schemas, confidence indicators, clear source notes, and deterministic YouTube search URLs.

## Accomplishments that we're proud of

- A complete understand → plan → practice → repair workflow in one prototype.
- Native PDF and text material support without a database.
- Actionable Bangla and English learning support.
- Topic-level YouTube resources that do not depend on hallucinated URLs.
- A polished, responsive experience that is immediately demonstrable with built-in RUET-style sample notes.

## What we learned

The most valuable educational AI does not simply answer a question. It helps a student choose the next action, practice retrieval, notice a weak concept, and reach a better explanation. Grounding and interface design matter as much as the model itself.

## What's next

- RUET course and department spaces shared by students and teachers
- Past-question analysis and syllabus coverage tracking
- Spaced-repetition reminders and calendar integration
- Teacher-reviewed resource lists
- Anonymous class-level weak-topic insights
- Voice explanations and diagram generation

## Built With

- Next.js 16
- React 19
- TypeScript
- Gemini 3.6 Flash
- Vercel AI SDK
- Google Generative AI API
- Zod
- Lucide
- Vercel

## Links to add before submitting

- **Demo video:** `ADD_YOUR_VIDEO_URL`
- **GitHub repository:** `ADD_YOUR_PUBLIC_GITHUB_URL`
- **Live demo:** `ADD_YOUR_VERCEL_URL`
