import type { UIMessage } from "ai";

export type ToolKind = "email" | "notes" | "planner" | "research";

export type HistoryEntry = {
  id: string;
  tool: ToolKind;
  title: string;
  subtitle: string;
  output: string;
  createdAt: number;
};

export type ChatThread = {
  id: string;
  title: string;
  updatedAt: number;
  messages: UIMessage[];
};

const HISTORY_KEY = "veridian.history.v1";
const THREADS_KEY = "veridian.threads.v1";

const hasWindow = () => typeof window !== "undefined";

export function makeId() {
  if (hasWindow() && "randomUUID" in crypto) return crypto.randomUUID();
  return Math.random().toString(36).slice(2, 10);
}

function read<T>(key: string, fallback: T): T {
  if (!hasWindow()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  if (!hasWindow()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable */
  }
}

/* ---------- Tool output history ---------- */

export function loadHistory(): HistoryEntry[] {
  return read<HistoryEntry[]>(HISTORY_KEY, []);
}

export function saveHistoryEntry(entry: Omit<HistoryEntry, "id" | "createdAt">): HistoryEntry[] {
  const next = [{ ...entry, id: makeId(), createdAt: Date.now() }, ...loadHistory()].slice(0, 24);
  write(HISTORY_KEY, next);
  return next;
}

export function clearHistory(): HistoryEntry[] {
  write(HISTORY_KEY, []);
  return [];
}

/* ---------- Chat threads ---------- */

export function loadThreads(): ChatThread[] {
  return read<ChatThread[]>(THREADS_KEY, []).sort((a, b) => b.updatedAt - a.updatedAt);
}

export function writeThreads(threads: ChatThread[]) {
  write(THREADS_KEY, threads);
}

export function createThread(): ChatThread {
  const thread: ChatThread = {
    id: makeId(),
    title: "New conversation",
    updatedAt: Date.now(),
    messages: [],
  };
  writeThreads([thread, ...loadThreads()]);
  return thread;
}

export function getThread(id: string): ChatThread | undefined {
  return loadThreads().find((t) => t.id === id);
}

/** Creates the thread if it does not exist yet, so a bookmarked URL still works. */
export function ensureThread(id: string): ChatThread {
  const existing = getThread(id);
  if (existing) return existing;
  const thread: ChatThread = { id, title: "New conversation", updatedAt: Date.now(), messages: [] };
  writeThreads([thread, ...loadThreads()]);
  return thread;
}

export function persistThreadMessages(id: string, messages: UIMessage[]) {
  const threads = loadThreads();
  const index = threads.findIndex((t) => t.id === id);
  if (index === -1) return;
  const first = messages.find((m) => m.role === "user");
  const firstText = first
    ? first.parts
        .map((p) => (p.type === "text" ? p.text : ""))
        .join(" ")
        .trim()
    : "";
  const existing = threads[index] as ChatThread;
  threads[index] = {
    ...existing,
    messages,
    title: firstText ? firstText.slice(0, 48) : existing.title,
    updatedAt: Date.now(),
  };
  writeThreads(threads);
}

export function deleteThread(id: string): ChatThread[] {
  const next = loadThreads().filter((t) => t.id !== id);
  writeThreads(next);
  return next;
}

export function relativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}
