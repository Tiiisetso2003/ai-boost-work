import { useServerFn } from "@tanstack/react-start";
import { Check, Copy } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { MessageResponse } from "@/components/ai-elements/message";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { runTool } from "@/lib/ai.functions";
import {
  loadHistory,
  relativeTime,
  saveHistoryEntry,
  type HistoryEntry,
  type ToolKind,
} from "@/lib/local-store";

export const DISCLAIMER = "AI-generated content may require human review.";

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-[12px] font-medium text-muted-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

const controlClass =
  "w-full rounded-lg bg-panel2 px-3 py-2.5 text-[13px] text-foreground ring-1 ring-line outline-none transition focus:ring-2 focus:ring-acc/40";

export function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
}) {
  return (
    <select className={controlClass} value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((o) => (
        <option key={o} value={o} className="bg-panel2 text-foreground">
          {o}
        </option>
      ))}
    </select>
  );
}

export function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      className={controlClass}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export function TextArea({
  value,
  onChange,
  rows = 4,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <textarea
      rows={rows}
      className={`${controlClass} resize-none leading-relaxed`}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export function PanelLabel({ children }: { children: ReactNode }) {
  return <p className="label-mono mb-4">{children}</p>;
}

export function ToolWorkspace({
  tool,
  heading,
  subheading,
  fields,
  historyTitle,
  historySubtitle,
  submitLabel,
  disabled,
  children,
}: {
  tool: ToolKind;
  heading: string;
  subheading: string;
  fields: Record<string, string>;
  historyTitle: string;
  historySubtitle: string;
  submitLabel: string;
  disabled?: boolean;
  children: ReactNode;
}) {
  const run = useServerFn(runTool);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setHistory(loadHistory().filter((h) => h.tool === tool));
  }, [tool]);

  async function handleRun() {
    setLoading(true);
    setError(null);
    setOutput("");
    try {
      const result = await run({ data: { tool, fields } });
      setOutput(result.text);
      const next = saveHistoryEntry({
        tool,
        title: historyTitle,
        subtitle: historySubtitle,
        output: result.text,
      });
      setHistory(next.filter((h) => h.tool === tool));
    } catch (e) {
      setError(
        e instanceof Error && e.message
          ? e.message
          : "The assistant could not finish that request. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <main className="max-w-[1500px] p-4 sm:p-6">
      <div className="mb-5 animate-rise">
        <h1 className="text-balance font-display text-[22px] font-bold tracking-tight sm:text-[26px]">
          {heading}
        </h1>
        <p className="mt-1 text-[13px] text-muted-foreground">{subheading}</p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <section className="animate-rise rounded-2xl bg-panel/50 p-5 ring-1 ring-foreground/8 backdrop-blur-xl lg:col-span-5">
          <PanelLabel>Prompt inputs</PanelLabel>
          <div className="space-y-4">{children}</div>
          <div className="mt-5 flex items-center gap-3">
            <button
              onClick={handleRun}
              disabled={loading || disabled}
              className="rounded-lg bg-gradient-to-br from-acc to-acc2 px-4 py-2.5 text-[13px] font-semibold text-background ring-1 ring-foreground/10 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Working…" : submitLabel}
            </button>
            {disabled && !loading && (
              <span className="font-mono text-[11px] text-muted-foreground">
                Add details to continue
              </span>
            )}
          </div>
        </section>

        <section className="animate-rise rounded-2xl bg-panel/50 p-5 ring-1 ring-foreground/8 backdrop-blur-xl lg:col-span-7">
          <div className="mb-4 flex items-center gap-3">
            <p className="label-mono">AI output</p>
            {loading && (
              <span className="flex items-center gap-1.5 font-mono text-[10px]">
                <span className="size-1.5 animate-pulse rounded-full bg-acc" aria-hidden />
                <Shimmer as="span" className="text-[10px]">
                  Generating…
                </Shimmer>
              </span>
            )}
            {output && !loading && (
              <button
                onClick={handleCopy}
                className="ml-auto flex items-center gap-1.5 rounded-lg bg-panel2/80 px-3 py-1.5 text-[12px] text-foreground ring-1 ring-foreground/8 transition hover:bg-foreground/10"
              >
                {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
            )}
          </div>

          <div className="min-h-[220px] rounded-xl bg-background/40 p-4 ring-1 ring-foreground/5">
            {loading && (
              <div className="space-y-2">
                <div className="skeleton-line h-3 w-11/12 rounded" />
                <div className="skeleton-line h-3 w-2/3 rounded" />
                <div className="skeleton-line h-3 w-4/5 rounded" />
                <div className="skeleton-line h-3 w-3/5 rounded" />
              </div>
            )}
            {!loading && error && <p className="text-[13px] text-destructive">{error}</p>}
            {!loading && !error && !output && (
              <p className="text-[13px] text-muted-foreground">
                Fill in the fields and run it — the finished result appears here.
              </p>
            )}
            {!loading && output && (
              <div className="animate-fadein">
                <MessageResponse className="text-[13px] leading-relaxed">{output}</MessageResponse>
              </div>
            )}
          </div>

          <p className="mt-4 flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span className="size-3 rounded-full ring-1 ring-line" aria-hidden />
            {DISCLAIMER}
          </p>
        </section>
      </div>

      {history.length > 0 && (
        <div className="mt-6">
          <p className="label-mono mb-3">Recent outputs</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {history.slice(0, 6).map((entry) => (
              <button
                key={entry.id}
                onClick={() => {
                  setOutput(entry.output);
                  setError(null);
                }}
                className="animate-rise rounded-2xl bg-panel/40 p-4 text-left ring-1 ring-foreground/8 backdrop-blur-xl transition hover:bg-panel/70 hover:ring-acc/30"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase text-acc">{entry.tool}</span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {relativeTime(entry.createdAt)}
                  </span>
                </div>
                <p className="mt-2 text-pretty font-display text-[14px] font-semibold tracking-tight">
                  {entry.title}
                </p>
                <p className="mt-1 text-pretty text-[12px] text-muted-foreground">
                  {entry.subtitle}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
