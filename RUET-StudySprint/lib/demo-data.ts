import type { AskResult, PlanResult, QuizResult } from "@/lib/types";
import { makeYouTubeResources } from "@/lib/youtube";

export const demoAsk: AskResult = {
  answer:
    "Context switch হলো CPU-কে এক process থেকে অন্য process-এ নেওয়ার প্রক্রিয়া। OS প্রথম process-এর state তার PCB-তে সংরক্ষণ করে, তারপর পরের process-এর saved state ফিরিয়ে আনে। এই সময় user-এর কোনো কাজ এগোয় না, তাই এটি overhead।",
  keyPoints: [
    "বর্তমান process-এর registers ও program counter PCB-তে save হয়।",
    "পরবর্তী process-এর state PCB থেকে restore হয়।",
    "বারবার context switch হলে CPU time নষ্ট হয়।",
  ],
  confidence: "high",
  sourceNote: "Demo note-এর ‘Context switch’ অংশের ভিত্তিতে উত্তর দেওয়া হয়েছে।",
  youtubeResources: makeYouTubeResources([
    "operating system context switch explained animation",
    "context switching operating system বাংলা tutorial",
    "context switch PCB operating system practice questions",
  ]),
};

export const demoPlan: PlanResult = {
  summary: "৭ দিনে concept, numerical scheduling এবং revision—এই তিন ধাপে প্রস্তুতি নাও।",
  topics: [
    {
      name: "CPU Scheduling & Gantt Chart",
      priority: "high",
      reason: "FCFS, SJF/SRTF এবং RR তুলনা ও numerical পরীক্ষার মূল অংশ।",
      youtubeResources: makeYouTubeResources([
        "CPU scheduling algorithms explained FCFS SJF Round Robin",
        "CPU scheduling algorithm বাংলা Gantt chart",
        "CPU scheduling numerical problems with solutions",
      ]),
    },
    {
      name: "Deadlock",
      priority: "high",
      reason: "চারটি condition, prevention ও avoidance থেকে সরাসরি প্রশ্ন আসে।",
      youtubeResources: makeYouTubeResources([
        "deadlock four conditions operating system explained",
        "deadlock operating system বাংলা tutorial",
        "bankers algorithm deadlock practice problems",
      ]),
    },
    {
      name: "Process & PCB",
      priority: "medium",
      reason: "Process state এবং context switch বোঝার ভিত্তি।",
      youtubeResources: makeYouTubeResources([
        "process states PCB operating system animation",
        "process control block বাংলা operating system",
        "process state diagram operating system questions",
      ]),
    },
  ],
  schedule: [
    { day: "Day 1", focus: "Process basics", duration: "60 min", tasks: ["Process states আঁকো", "PCB fields flashcard বানাও"] },
    { day: "Day 2", focus: "FCFS & SJF", duration: "75 min", tasks: ["Concept review", "৩টি Gantt chart solve"] },
    { day: "Day 3", focus: "SRTF & RR", duration: "75 min", tasks: ["Preemption বুঝো", "Quantum বদলে result দেখো"] },
    { day: "Day 4", focus: "Scheduling metrics", duration: "60 min", tasks: ["Waiting/turnaround formula", "Mixed numerical practice"] },
    { day: "Day 5", focus: "Deadlock", duration: "75 min", tasks: ["৪টি condition মুখস্থ", "Prevention বনাম avoidance"] },
    { day: "Day 6", focus: "Weak-topic repair", duration: "60 min", tasks: ["ভুলগুলো review", "Targeted YouTube resource দেখো"] },
    { day: "Day 7", focus: "Mock & revision", duration: "90 min", tasks: ["১০ প্রশ্নের mock", "One-page cheat sheet"] },
  ],
  quickWin: "আজ ২০ মিনিটে FCFS ও SJF-এর একটি করে Gantt chart সমাধান করো।",
};

export const demoQuiz: QuizResult = {
  title: "Process Management · Quick Check",
  questions: [
    {
      question: "কোন scheduling algorithm minimum average waiting time দেয়, যদি burst time জানা থাকে?",
      options: ["FCFS", "SJF", "Round Robin", "Priority"],
      correctIndex: 1,
      explanation: "SJF সবচেয়ে ছোট CPU burst আগে চালায়, তাই পরিচিত burst time-এর ক্ষেত্রে average waiting time সর্বনিম্ন হয়।",
      topic: "CPU Scheduling",
      difficulty: "easy",
      youtubeResources: makeYouTubeResources(["SJF scheduling explained", "SJF scheduling বাংলা", "SJF numerical problems"]),
    },
    {
      question: "Round Robin-এর time quantum খুব বড় হলে এটি কোন algorithm-এর মতো হয়?",
      options: ["SRTF", "FCFS", "SJF", "Banker’s algorithm"],
      correctIndex: 1,
      explanation: "Quantum খুব বড় হলে প্রতিটি process সাধারণত একবারেই শেষ হয়, তাই আচরণ FCFS-এর মতো হয়।",
      topic: "Round Robin",
      difficulty: "medium",
      youtubeResources: makeYouTubeResources(["round robin time quantum explained", "round robin বাংলা", "round robin numerical problems"]),
    },
    {
      question: "নিচের কোনটি deadlock-এর চারটি necessary condition-এর একটি নয়?",
      options: ["Mutual exclusion", "Hold and wait", "Aging", "Circular wait"],
      correctIndex: 2,
      explanation: "Aging starvation প্রতিরোধ করে; এটি deadlock-এর necessary condition নয়।",
      topic: "Deadlock",
      difficulty: "medium",
      youtubeResources: makeYouTubeResources(["deadlock four conditions", "deadlock বাংলা operating system", "deadlock MCQ practice"]),
    },
    {
      question: "Waiting time কী মাপে?",
      options: ["CPU-তে চলার মোট সময়", "Ready queue-তে কাটানো মোট সময়", "প্রথম response পর্যন্ত সময়", "Arrival থেকে completion পর্যন্ত সময়"],
      correctIndex: 1,
      explanation: "Waiting time হলো process-এর ready queue-তে অপেক্ষা করার মোট সময়।",
      topic: "Scheduling Metrics",
      difficulty: "easy",
      youtubeResources: makeYouTubeResources(["waiting turnaround response time operating system", "CPU scheduling time বাংলা", "scheduling metrics problems"]),
    },
    {
      question: "Priority scheduling-এ starvation কমানোর প্রচলিত পদ্ধতি কোনটি?",
      options: ["Paging", "Aging", "Spooling", "Context switching"],
      correctIndex: 1,
      explanation: "Aging দীর্ঘ সময় অপেক্ষা করা process-এর priority ধীরে ধীরে বাড়ায়, তাই starvation কমে।",
      topic: "Priority Scheduling",
      difficulty: "medium",
      youtubeResources: makeYouTubeResources(["aging starvation priority scheduling", "priority scheduling aging বাংলা", "starvation aging operating system MCQ"]),
    },
  ],
};
