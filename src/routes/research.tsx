import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { AppShell } from "@/components/AppShell";
import { Field, Select, TextArea, TextInput, ToolWorkspace } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Veridian Work OS" },
      {
        name: "description",
        content:
          "Ask a work question and get an executive summary, key insights, trade-offs and next steps written for a decision-maker.",
      },
      { property: "og:title", content: "AI Research Assistant — Veridian Work OS" },
      {
        property: "og:description",
        content: "Insights, trade-offs and next steps in a briefing you can act on.",
      },
    ],
  }),
  component: ResearchPage,
});

const DEPTHS = ["Quick scan", "Standard briefing", "Deep dive"] as const;
const AUDIENCES = ["Executive team", "Product team", "Just me", "Client-facing"] as const;

function ResearchPage() {
  const [topic, setTopic] = useState("What are the main drivers of churn in B2B SaaS onboarding?");
  const [depth, setDepth] = useState<string>(DEPTHS[1]);
  const [audience, setAudience] = useState<string>(AUDIENCES[0]);
  const [context, setContext] = useState("Mid-market product, 14-day trial, self-serve signup.");

  return (
    <AppShell title="Research" badge="Tool · 04">
      <ToolWorkspace
        tool="research"
        heading="A briefing you can take into the room"
        subheading="Ask the question — get insights, trade-offs and next steps."
        submitLabel="Run research"
        fields={{ topic, depth, audience, context }}
        disabled={topic.trim().length < 8}
        historyTitle={topic.trim().slice(0, 60) || "Research briefing"}
        historySubtitle={`${depth} · ${audience}`}
      >
        <Field label="Research question">
          <TextInput value={topic} onChange={setTopic} placeholder="What should we know about…" />
        </Field>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Depth">
            <Select value={depth} onChange={setDepth} options={DEPTHS} />
          </Field>
          <Field label="Written for">
            <Select value={audience} onChange={setAudience} options={AUDIENCES} />
          </Field>
        </div>
        <Field label="Extra context">
          <TextArea value={context} onChange={setContext} rows={4} />
        </Field>
      </ToolWorkspace>
    </AppShell>
  );
}
