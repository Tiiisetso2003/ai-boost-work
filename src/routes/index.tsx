import { Link, createFileRoute } from "@tanstack/react-router";
import { ClipboardList, ListChecks, Mail, MessageSquare, Telescope } from "lucide-react";
import { useEffect, useState } from "react";

import { AppShell } from "@/components/AppShell";
import { DISCLAIMER } from "@/components/ToolWorkspace";
import { loadHistory, loadThreads, relativeTime, type HistoryEntry } from "@/lib/local-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Veridian Work OS — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Draft email, summarise meetings, plan your day and research decisions with one calm AI workspace built for professionals.",
      },
      { property: "og:title", content: "Veridian Work OS — AI Workplace Assistant" },
      {
        property: "og:description",
        content:
          "Email drafting, meeting summaries, task planning, research briefings and chat in one professional workspace.",
      },
    ],
  }),
  component: Dashboard,
});

const TOOLS = [
  {
    to: "/email" as const,
    icon: Mail,
    name: "Smart Email Generator",
    copy: "Tone and audience aware drafts, ready to review and send.",
    tag: "01",
  },
  {
    to: "/notes" as const,
    icon: ClipboardList,
    name: "Meeting Notes Summarizer",
    copy: "Key points, owners, action items and deadlines from raw notes.",
    tag: "02",
  },
  {
    to: "/planner" as const,
    icon: ListChecks,
    name: "AI Task Planner",
    copy: "Prioritised and scheduled into the hours you actually have.",
    tag: "03",
  },
  {
    to: "/research" as const,
    icon: Telescope,
    name: "AI Research Assistant",
    copy: "Insights, trade-offs and next steps in a decision-ready brief.",
    tag: "04",
  },
];

function Dashboard() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [threadCount, setThreadCount] = useState(0);

  useEffect(() => {
    setHistory(loadHistory());
    setThreadCount(loadThreads().length);
  }, []);

  return (
    <AppShell title="Dashboard" badge="Workspace">
      <main className="max-w-[1500px] p-4 sm:p-6">
        <section className="animate-rise overflow-hidden rounded-2xl bg-panel/50 p-6 ring-1 ring-foreground/8 backdrop-blur-xl sm:p-8">
          <h1 className="max-w-2xl text-balance font-display text-[26px] font-bold leading-tight tracking-tight sm:text-[34px]">
            Five assistants for the work that eats your day.
          </h1>
          <p className="mt-3 max-w-xl text-pretty text-[14px] leading-relaxed text-muted-foreground">
            Pick a tool, give it the details you already have, and get a professional draft you can
            edit. Everything you generate stays in this browser.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/email"
              className="rounded-lg bg-gradient-to-br from-acc to-acc2 px-4 py-2.5 text-[13px] font-semibold text-background ring-1 ring-foreground/10 transition hover:brightness-110"
            >
              Draft an email
            </Link>
            <Link
              to="/chat"
              className="rounded-lg bg-panel2/80 px-4 py-2.5 text-[13px] font-medium text-foreground ring-1 ring-foreground/10 transition hover:bg-foreground/10"
            >
              Open the assistant
            </Link>
          </div>
        </section>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {TOOLS.map((tool) => (
            <Link
              key={tool.to}
              to={tool.to}
              className="group animate-rise rounded-2xl bg-panel/40 p-5 ring-1 ring-foreground/8 backdrop-blur-xl transition hover:bg-panel/70 hover:ring-acc/30"
            >
              <div className="flex items-center justify-between">
                <span className="grid size-9 place-items-center rounded-xl bg-acc/10 text-acc ring-1 ring-acc/20">
                  <tool.icon className="size-4" />
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">{tool.tag}</span>
              </div>
              <p className="mt-4 text-pretty font-display text-[15px] font-semibold tracking-tight">
                {tool.name}
              </p>
              <p className="mt-1.5 text-pretty text-[12.5px] leading-relaxed text-muted-foreground">
                {tool.copy}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <section className="animate-rise rounded-2xl bg-panel/40 p-5 ring-1 ring-foreground/8 backdrop-blur-xl lg:col-span-2">
            <p className="label-mono mb-4">Recent outputs</p>
            {history.length === 0 ? (
              <p className="text-[13px] text-muted-foreground">
                Nothing yet — whatever you generate will show up here.
              </p>
            ) : (
              <ul className="divide-y divide-line/70">
                {history.slice(0, 6).map((entry) => (
                  <li key={entry.id} className="flex items-center gap-4 py-3">
                    <span className="w-16 shrink-0 font-mono text-[10px] uppercase text-acc">
                      {entry.tool}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-medium">{entry.title}</p>
                      <p className="truncate text-[12px] text-muted-foreground">{entry.subtitle}</p>
                    </div>
                    <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
                      {relativeTime(entry.createdAt)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="animate-rise flex flex-col rounded-2xl bg-panel/40 p-5 ring-1 ring-foreground/8 backdrop-blur-xl">
            <p className="label-mono mb-4">This browser</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-background/40 p-4 ring-1 ring-foreground/5">
                <p className="font-display text-[24px] font-bold tracking-tight">
                  {history.length}
                </p>
                <p className="mt-1 text-[12px] text-muted-foreground">Saved outputs</p>
              </div>
              <div className="rounded-xl bg-background/40 p-4 ring-1 ring-foreground/5">
                <p className="font-display text-[24px] font-bold tracking-tight">{threadCount}</p>
                <p className="mt-1 text-[12px] text-muted-foreground">Conversations</p>
              </div>
            </div>
            <Link
              to="/chat"
              className="mt-4 flex items-center gap-2 rounded-xl bg-background/40 p-4 text-[13px] ring-1 ring-foreground/5 transition hover:ring-acc/30"
            >
              <MessageSquare className="size-4 text-acc" />
              Continue a conversation
            </Link>
            <p className="mt-auto pt-4 text-[11px] text-muted-foreground">{DISCLAIMER}</p>
          </section>
        </div>
      </main>
    </AppShell>
  );
}
