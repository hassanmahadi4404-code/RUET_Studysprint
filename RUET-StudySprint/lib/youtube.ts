import type { YouTubeResource } from "@/lib/types";

const LABELS = ["সহজ ব্যাখ্যা", "বাংলা টিউটোরিয়াল", "Practice & problems"];

export function makeYouTubeResources(queries: string[]): YouTubeResource[] {
  return queries.slice(0, 3).map((query, index) => ({
    label: LABELS[index] ?? `Resource ${index + 1}`,
    query,
    url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
  }));
}
