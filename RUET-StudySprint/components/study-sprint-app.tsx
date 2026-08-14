"use client";

import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Clock3,
  FileText,
  GraduationCap,
  Lightbulb,
  Link2,
  LoaderCircle,
  Menu,
  MessageSquareText,
  Play,
  RotateCcw,
  Search,
  Sparkles,
  Target,
  UploadCloud,
  X,
} from "lucide-react";
import { useMemo, useRef, useState, type Dispatch, type SetStateAction } from "react";

import { SAMPLE_TITLE } from "@/lib/sample-material";
import type {
  Action,
  ApiError,
  ApiSuccess,
  AskResult,
  GenerateResult,
  Language,
  Material,
  PlanResult,
  QuizResult,
  YouTubeResource,
} from "@/lib/types";

type View = "ask" | "plan" | "quiz";
type MaterialMode = "sample" | "text" | "file";
type UploadedFile = { name: string; mediaType: string; data: string; size: string };

const prompts = [
  "Context switch সহজভাবে বুঝিয়ে দাও",
  "Starvation আর deadlock-এর পার্থক্য কী?",
  "Round Robin-এ time quantum কেন গুরুত্বপূর্ণ?",
];

const views: Array<{ id: View; label: string; shortLabel: string; icon: typeof MessageSquareText }> = [
  { id: "ask", label: "Ask your notes", shortLabel: "Ask", icon: MessageSquareText },
  { id: "plan", label: "Study plan", shortLabel: "Plan", icon: Target },
  { id: "quiz", label: "Practice quiz", shortLabel: "Quiz", icon: BrainCircuit },
];

function isAskResult(result: GenerateResult | null): result is AskResult {
  return Boolean(result && "answer" in result);
}

function isPlanResult(result: GenerateResult | null): result is PlanResult {
  return Boolean(result && "schedule" in result);
}

function isQuizResult(result: GenerateResult | null): result is QuizResult {
  return Boolean(result && "questions" in result);
}

function ResourceLinks({ resources, compact = false }: { resources: YouTubeResource[]; compact?: boolean }) {
  return (
    <div className={compact ? "resource-list compact" : "resource-list"}>
      {resources.map((resource, index) => (
        <a key={`${resource.query}-${index}`} className="resource-link" href={resource.url} target="_blank" rel="noreferrer">
          <span className="youtube-icon"><Play size={15} strokeWidth={2.4} fill="currentColor" /></span>
          <span>
            <strong>{resource.label}</strong>
            {!compact && <small>{resource.query}</small>}
          </span>
          <ArrowRight size={14} />
        </a>
      ))}
    </div>
  );
}

function LoadingCard({ action }: { action: Action }) {
  const label = action === "ask" ? "Finding the clearest answer" : action === "plan" ? "Building your study route" : "Writing a balanced quiz";
  return (
    <div className="loading-card" aria-live="polite">
      <div className="loading-orbit"><Sparkles size={21} /></div>
      <div>
        <strong>{label}…</strong>
        <p>Gemini course material পড়ছে এবং useful resources খুঁজে সাজাচ্ছে।</p>
      </div>
      <div className="loading-line"><span /></div>
    </div>
  );
}

export function StudySprintApp() {
  const [view, setView] = useState<View>("ask");
  const [language, setLanguage] = useState<Language>("বাংলা");
  const [materialMode, setMaterialMode] = useState<MaterialMode>("sample");
  const [pastedText, setPastedText] = useState("");
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [question, setQuestion] = useState("");
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState<Action | null>(null);
  const [error, setError] = useState("");
  const [askResult, setAskResult] = useState<AskResult | null>(null);
  const [planResult, setPlanResult] = useState<PlanResult | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [runMode, setRunMode] = useState<"gemini" | "demo" | null>(null);
  const [mobilePanel, setMobilePanel] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const fileInput = useRef<HTMLInputElement>(null);

  const activeResult = view === "ask" ? askResult : view === "plan" ? planResult : quizResult;
  const materialLabel = materialMode === "sample" ? SAMPLE_TITLE : materialMode === "file" ? uploadedFile?.name ?? "Uploaded file" : "Pasted notes";

  const material = useMemo<Material>(() => {
    if (materialMode === "sample") return { source: "sample" };
    if (materialMode === "text") return { source: "text", text: pastedText };
    return {
      source: "file",
      fileData: uploadedFile?.data,
      mediaType: uploadedFile?.mediaType,
      filename: uploadedFile?.name,
    };
  }, [materialMode, pastedText, uploadedFile]);

  const score = useMemo(() => {
    if (!quizResult) return 0;
    return quizResult.questions.reduce((total, item, index) => total + (answers[index] === item.correctIndex ? 1 : 0), 0);
  }, [answers, quizResult]);

  async function handleFile(file?: File) {
    if (!file) return;
    setError("");
    const allowed = ["application/pdf", "text/plain", "text/markdown"];
    if (!allowed.includes(file.type) && !file.name.match(/\.(pdf|txt|md)$/i)) {
      setError("শুধু PDF, TXT অথবা Markdown file ব্যবহার করুন।");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setError("File 4 MB-এর নিচে রাখুন।");
      return;
    }

    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("Could not read file"));
      reader.readAsDataURL(file);
    });
    setUploadedFile({
      name: file.name,
      mediaType: file.type || (file.name.endsWith(".pdf") ? "application/pdf" : "text/plain"),
      data: dataUrl.split(",")[1] ?? "",
      size: `${(file.size / 1024).toFixed(0)} KB`,
    });
    setMaterialMode("file");
  }

  async function run(action: Action, overrideQuestion?: string) {
    const finalQuestion = overrideQuestion ?? question;
    if (action === "ask" && !finalQuestion.trim()) {
      setError("প্রথমে একটি প্রশ্ন লিখুন।");
      return;
    }
    if (materialMode === "text" && !pastedText.trim()) {
      setError("প্রথমে course notes paste করুন।");
      return;
    }
    if (materialMode === "file" && !uploadedFile) {
      setError("প্রথমে একটি file upload করুন।");
      return;
    }

    setError("");
    setLoading(action);
    setView(action);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, material, language, question: finalQuestion, days }),
      });
      const data = (await response.json()) as ApiSuccess | ApiError;
      if (!response.ok || !data.ok) throw new Error(data.ok ? "Request failed" : data.error);
      setRunMode(data.mode);
      if (action === "ask" && isAskResult(data.result)) setAskResult(data.result);
      if (action === "plan" && isPlanResult(data.result)) setPlanResult(data.result);
      if (action === "quiz" && isQuizResult(data.result)) {
        setQuizResult(data.result);
        setQuizIndex(0);
        setAnswers({});
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(null);
    }
  }

  function choosePrompt(prompt: string) {
    setQuestion(prompt);
    void run("ask", prompt);
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="mobile-menu" onClick={() => setMobilePanel(true)} aria-label="Open materials panel"><Menu /></button>
        <a className="brand" href="#top" aria-label="StudySprint home">
          <span className="brand-mark"><BookOpen size={20} /><Sparkles size={10} /></span>
          <span><strong>StudySprint</strong><small>RUET AI COMPANION</small></span>
        </a>
        <div className="topbar-center"><span className="pulse-dot" /> Course workspace <span>/</span> {materialLabel}</div>
        <div className="topbar-actions">
          <div className="language-toggle" role="group" aria-label="Response language">
            {(["বাংলা", "English"] as Language[]).map((item) => (
              <button key={item} className={language === item ? "active" : ""} onClick={() => setLanguage(item)}>{item}</button>
            ))}
          </div>
          <span className="gemini-badge"><Sparkles size={14} /> Gemini 3.6 Flash</span>
        </div>
      </header>

      <div className="workspace" id="top">
        <aside className={`material-panel ${mobilePanel ? "open" : ""}`}>
          <div className="panel-mobile-head"><strong>Course material</strong><button onClick={() => setMobilePanel(false)} aria-label="Close"><X /></button></div>
          <div className="panel-heading">
            <span>COURSE CONTEXT</span>
            <span className="context-status"><Check size={12} /> READY</span>
          </div>

          <button className={`sample-card ${materialMode === "sample" ? "selected" : ""}`} onClick={() => setMaterialMode("sample")}>
            <span className="file-tile"><FileText size={20} /></span>
            <span><strong>{SAMPLE_TITLE}</strong><small>Demo notes · 6 topics</small></span>
            <span className="radio-dot" />
          </button>

          <div className="or-divider"><span>or use your material</span></div>

          <button
            className={`drop-zone ${dragging ? "dragging" : ""} ${materialMode === "file" ? "selected" : ""}`}
            onClick={() => fileInput.current?.click()}
            onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => { event.preventDefault(); setDragging(false); void handleFile(event.dataTransfer.files[0]); }}
          >
            <input ref={fileInput} type="file" accept=".pdf,.txt,.md,application/pdf,text/plain,text/markdown" onChange={(event) => void handleFile(event.target.files?.[0])} hidden />
            <UploadCloud size={24} />
            {uploadedFile ? (
              <><strong>{uploadedFile.name}</strong><span>{uploadedFile.size} · Click to replace</span></>
            ) : (
              <><strong>Drop course file here</strong><span>PDF, TXT or MD · max 4 MB</span></>
            )}
          </button>

          <label className="paste-label">
            <span>OR PASTE NOTES</span>
            <textarea
              value={pastedText}
              onFocus={() => setMaterialMode("text")}
              onChange={(event) => { setPastedText(event.target.value); setMaterialMode("text"); }}
              placeholder="Lecture note, syllabus বা গুরুত্বপূর্ণ অংশ paste করুন…"
            />
            <small>{pastedText.length.toLocaleString()} / 80,000 characters</small>
          </label>

          <div className="privacy-note"><span><Check size={14} /></span><p><strong>Your notes stay private</strong>Material শুধু আপনার request process করতে ব্যবহার হয়।</p></div>

          <div className="sidebar-footer">
            <div><GraduationCap size={18} /><span><strong>Built for RUET Hack Day</strong><small>From scattered notes to a clear next step.</small></span></div>
          </div>
        </aside>
        {mobilePanel && <button className="mobile-overlay" aria-label="Close materials panel" onClick={() => setMobilePanel(false)} />}

        <main className="main-content">
          <section className="hero">
            <div>
              <span className="eyebrow"><span>01</span> YOUR NEXT STUDY MOVE</span>
              <h1>Course chaos থেকে<br /><em>clear preparation.</em></h1>
              <p>একটি material দিন। AI সেখান থেকেই বুঝিয়ে দেবে, plan বানাবে, quiz নেবে এবং ঠিক topic-এর YouTube resource দেবে।</p>
            </div>
            <div className="hero-note">
              <Lightbulb size={20} />
              <span><small>TODAY’S QUICK WIN</small><strong>একটি দুর্বল topic বেছে 20 মিনিটে concept + 5 প্রশ্ন শেষ করুন।</strong></span>
            </div>
          </section>

          <nav className="view-tabs" aria-label="Study tools">
            {views.map((item, index) => {
              const Icon = item.icon;
              return (
                <button key={item.id} className={view === item.id ? "active" : ""} onClick={() => setView(item.id)}>
                  <span className="tab-number">0{index + 1}</span><Icon size={18} /><span className="wide-label">{item.label}</span><span className="short-label">{item.shortLabel}</span>
                </button>
              );
            })}
          </nav>

          {error && <div className="error-banner" role="alert"><CircleAlert size={18} /><span>{error}</span><button onClick={() => setError("")} aria-label="Dismiss"><X size={17} /></button></div>}
          {runMode === "demo" && activeResult && <div className="demo-banner"><Sparkles size={15} /><span>Sample demo চলছে। নিজের material analyze করতে নতুন Gemini key <code>.env.local</code>-এ যোগ করুন।</span></div>}

          <section className="tool-stage">
            {view === "ask" && (
              <div className="ask-layout">
                <div className="composer-card">
                  <div className="composer-title"><span><Search size={17} /></span><div><strong>Course material-কে প্রশ্ন করুন</strong><small>উত্তর শুধু selected material-এর ভিত্তিতে হবে</small></div></div>
                  <textarea value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="যে concept বুঝতে সমস্যা হচ্ছে, সেটি লিখুন…" onKeyDown={(event) => { if ((event.metaKey || event.ctrlKey) && event.key === "Enter") void run("ask"); }} />
                  <div className="composer-footer"><span><Sparkles size={14} /> Grounded in {materialLabel}</span><button onClick={() => void run("ask")} disabled={loading !== null}>{loading === "ask" ? <LoaderCircle className="spin" size={18} /> : <ArrowRight size={18} />} Ask StudySprint</button></div>
                </div>
                {!askResult && loading !== "ask" && (
                  <div className="prompt-starters"><span>TRY A QUESTION</span>{prompts.map((prompt) => <button key={prompt} onClick={() => choosePrompt(prompt)}>{prompt}<ArrowRight size={15} /></button>)}</div>
                )}
                {loading === "ask" && <LoadingCard action="ask" />}
                {askResult && loading !== "ask" && <AnswerCard result={askResult} />}
              </div>
            )}

            {view === "plan" && (
              <div className="plan-layout">
                <div className="plan-control">
                  <div><span className="section-kicker">EXAM MODE</span><h2>কত দিনের plan দরকার?</h2><p>Material-এর গুরুত্ব অনুযায়ী concept, practice ও revision ভাগ হবে।</p></div>
                  <div className="day-options">{[3, 7, 14].map((item) => <button key={item} className={days === item ? "active" : ""} onClick={() => setDays(item)}><strong>{item}</strong><span>days</span></button>)}</div>
                  <button className="primary-action" onClick={() => void run("plan")} disabled={loading !== null}>{loading === "plan" ? <LoaderCircle className="spin" /> : <Sparkles />} Generate my plan <ArrowRight /></button>
                </div>
                {loading === "plan" && <LoadingCard action="plan" />}
                {planResult && loading !== "plan" && <StudyPlan result={planResult} />}
                {!planResult && loading !== "plan" && <PlanPreview />}
              </div>
            )}

            {view === "quiz" && (
              <div className="quiz-layout">
                {!quizResult && loading !== "quiz" && (
                  <div className="quiz-empty">
                    <div className="quiz-visual"><span>?</span><span>A</span><span>B</span><BrainCircuit /></div>
                    <span className="section-kicker">ACTIVE RECALL</span><h2>পড়ে ফেলেছেন? এবার বুঝেছেন কিনা দেখুন।</h2><p>AI material থেকে conceptual MCQ, plausible options এবং ভুলের ব্যাখ্যা তৈরি করবে।</p>
                    <button className="primary-action" onClick={() => void run("quiz")}><Play /> Start a 5-question quiz <ArrowRight /></button>
                  </div>
                )}
                {loading === "quiz" && <LoadingCard action="quiz" />}
                {quizResult && loading !== "quiz" && (
                  <QuizPlayer result={quizResult} index={quizIndex} setIndex={setQuizIndex} answers={answers} setAnswers={setAnswers} score={score} onRestart={() => void run("quiz")} />
                )}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

function AnswerCard({ result }: { result: AskResult }) {
  return (
    <article className="answer-card">
      <div className="answer-head"><span className="ai-avatar"><Sparkles /></span><div><span>STUDYSPRINT ANSWER</span><small><span className="grounded-dot" /> Grounded in your material · {result.confidence} confidence</small></div></div>
      <p className="answer-copy">{result.answer}</p>
      <div className="key-points"><strong><Target size={16} /> পরীক্ষার জন্য মনে রাখুন</strong><ul>{result.keyPoints.map((point) => <li key={point}>{point}</li>)}</ul></div>
      <div className="source-note"><Link2 size={15} /><span><strong>Material connection</strong>{result.sourceNote}</span></div>
      <div className="resource-section"><div className="resource-heading"><span><Play size={18} fill="currentColor" /></span><div><strong>আরও ভালোভাবে বুঝুন</strong><small>Targeted YouTube resources for this topic</small></div></div><ResourceLinks resources={result.youtubeResources} /></div>
    </article>
  );
}

function StudyPlan({ result }: { result: PlanResult }) {
  return (
    <div className="generated-plan">
      <div className="plan-summary"><span><Sparkles size={18} /></span><div><small>YOUR ROUTE</small><strong>{result.summary}</strong></div></div>
      <div className="priority-grid">
        {result.topics.map((topic, index) => (
          <article key={topic.name} className="topic-card">
            <div className="topic-index">0{index + 1}</div><span className={`priority ${topic.priority}`}>{topic.priority}</span>
            <h3>{topic.name}</h3><p>{topic.reason}</p>
            <ResourceLinks resources={topic.youtubeResources.slice(0, 1)} compact />
          </article>
        ))}
      </div>
      <div className="schedule-card">
        <div className="schedule-head"><div><span className="section-kicker">DAY BY DAY</span><h2>আপনার study schedule</h2></div><span><Clock3 size={16} /> Focused sessions</span></div>
        <div className="schedule-list">{result.schedule.map((item, index) => <div className="schedule-row" key={`${item.day}-${index}`}><div className="day-marker"><span>{item.day}</span><i /></div><div><strong>{item.focus}</strong><small>{item.duration}</small></div><ul>{item.tasks.map((task) => <li key={task}><Check size={13} />{task}</li>)}</ul></div>)}</div>
      </div>
      <div className="quick-win"><Lightbulb /><span><small>START RIGHT NOW</small><strong>{result.quickWin}</strong></span></div>
    </div>
  );
}

function PlanPreview() {
  return (
    <div className="plan-preview" aria-hidden="true">
      <div className="preview-lines"><span /><span /><span /></div>
      <div className="preview-route"><div><b>01</b><span>Concept</span></div><i /><div><b>02</b><span>Practice</span></div><i /><div><b>03</b><span>Revision</span></div></div>
      <p><Sparkles size={16} /> Your personalized route will appear here.</p>
    </div>
  );
}

function QuizPlayer({
  result,
  index,
  setIndex,
  answers,
  setAnswers,
  score,
  onRestart,
}: {
  result: QuizResult;
  index: number;
  setIndex: (index: number) => void;
  answers: Record<number, number>;
  setAnswers: Dispatch<SetStateAction<Record<number, number>>>;
  score: number;
  onRestart: () => void;
}) {
  const item = result.questions[index];
  const selected = answers[index];
  const answered = selected !== undefined;
  const finished = Object.keys(answers).length === result.questions.length;
  if (!item) return null;

  return (
    <div className="quiz-player">
      <div className="quiz-topline"><div><span className="section-kicker">{result.title}</span><h2>Question {index + 1} <span>/ {result.questions.length}</span></h2></div><div className="score-pill"><Target size={16} /> {score} correct</div></div>
      <div className="quiz-progress">{result.questions.map((question, questionIndex) => <button key={`${question.topic}-${questionIndex}`} className={`${questionIndex === index ? "current" : ""} ${answers[questionIndex] !== undefined ? "answered" : ""}`} onClick={() => setIndex(questionIndex)} aria-label={`Question ${questionIndex + 1}`}><span /></button>)}</div>
      <article className="question-card">
        <div className="question-meta"><span>{item.topic}</span><span className={`difficulty ${item.difficulty}`}>{item.difficulty}</span></div>
        <h3>{item.question}</h3>
        <div className="options-grid">
          {item.options.map((option, optionIndex) => {
            const correct = answered && optionIndex === item.correctIndex;
            const wrong = answered && optionIndex === selected && selected !== item.correctIndex;
            return <button key={option} className={`${correct ? "correct" : ""} ${wrong ? "wrong" : ""}`} disabled={answered} onClick={() => setAnswers((current) => ({ ...current, [index]: optionIndex }))}><span>{String.fromCharCode(65 + optionIndex)}</span>{option}{correct && <Check size={18} />}{wrong && <X size={18} />}</button>;
          })}
        </div>
        {answered && <div className="explanation"><span><Lightbulb size={17} /></span><div><strong>{selected === item.correctIndex ? "ঠিক ধরেছেন!" : "এখানে একটু revise করুন"}</strong><p>{item.explanation}</p></div></div>}
        {answered && selected !== item.correctIndex && <div className="quiz-resources"><strong><Play size={17} /> এই topic-টি বুঝতে</strong><ResourceLinks resources={item.youtubeResources} compact /></div>}
      </article>
      <div className="quiz-nav"><button disabled={index === 0} onClick={() => setIndex(index - 1)}><ChevronLeft /> Previous</button>{finished && <span className="finish-score">Score: <strong>{score}/{result.questions.length}</strong></span>}<button className="next" onClick={index === result.questions.length - 1 ? onRestart : () => setIndex(index + 1)}>{index === result.questions.length - 1 ? <><RotateCcw /> New quiz</> : <>Next <ChevronRight /></>}</button></div>
    </div>
  );
}
