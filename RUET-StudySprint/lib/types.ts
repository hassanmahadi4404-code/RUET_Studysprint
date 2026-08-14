export type Language = "বাংলা" | "English";
export type Action = "ask" | "plan" | "quiz";

export type Material = {
  source: "sample" | "text" | "file";
  text?: string;
  fileData?: string;
  mediaType?: string;
  filename?: string;
};

export type YouTubeResource = {
  label: string;
  query: string;
  url: string;
};

export type AskResult = {
  answer: string;
  keyPoints: string[];
  confidence: "high" | "medium" | "low";
  sourceNote: string;
  youtubeResources: YouTubeResource[];
};

export type PlanResult = {
  summary: string;
  topics: Array<{
    name: string;
    priority: "high" | "medium" | "low";
    reason: string;
    youtubeResources: YouTubeResource[];
  }>;
  schedule: Array<{
    day: string;
    focus: string;
    duration: string;
    tasks: string[];
  }>;
  quickWin: string;
};

export type QuizQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  youtubeResources: YouTubeResource[];
};

export type QuizResult = {
  title: string;
  questions: QuizQuestion[];
};

export type GenerateResult = AskResult | PlanResult | QuizResult;

export type ApiSuccess<T extends GenerateResult = GenerateResult> = {
  ok: true;
  mode: "gemini" | "demo";
  model: string;
  result: T;
};

export type ApiError = { ok: false; error: string };
