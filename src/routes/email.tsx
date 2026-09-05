import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { AppShell } from "@/components/AppShell";
import { Field, Select, TextArea, ToolWorkspace } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Veridian Work OS" },
      {
        name: "description",
        content:
          "Draft professional workplace email in seconds. Pick a tone and audience, add your key points, and get a clean, ready-to-review draft.",
      },
      { property: "og:title", content: "Smart Email Generator — Veridian Work OS" },
      {
        property: "og:description",
        content: "Tone and audience aware email drafting for busy professionals.",
      },
    ],
  }),
  component: EmailPage,
});

const TONES = ["Confident & calm", "Formal", "Friendly", "Assertive", "Apologetic"] as const;
const AUDIENCES = [
  "Executive client",
  "Internal team",
  "New prospect",
  "Direct manager",
  "External vendor",
] as const;
const LENGTHS = ["Short (3-4 lines)", "Standard", "Detailed"] as const;

function EmailPage() {
  const [tone, setTone] = useState<string>(TONES[0]);
  const [audience, setAudience] = useState<string>(AUDIENCES[0]);
  const [length, setLength] = useState<string>(LENGTHS[1]);
  const [context, setContext] = useState(
    "Thanks for the call. Confirm the Q3 rollout scope, flag the two open risks, and propose a 30-min follow-up for next week.",
  );

  return (
    <AppShell title="Email Generator" badge="Tool · 01">
      <ToolWorkspace
        tool="email"
        heading="Draft a reply as a calm, confident expert"
        subheading="Tune tone and audience, then let Veridian shape the message."
        submitLabel="Generate reply"
        fields={{ tone, audience, length, context }}
        disabled={context.trim().length < 8}
        historyTitle={context.trim().slice(0, 60) || "Email draft"}
        historySubtitle={`${tone} · ${audience}`}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Tone">
            <Select value={tone} onChange={setTone} options={TONES} />
          </Field>
          <Field label="Audience">
            <Select value={audience} onChange={setAudience} options={AUDIENCES} />
          </Field>
        </div>
        <Field label="Length">
          <Select value={length} onChange={setLength} options={LENGTHS} />
        </Field>
        <Field label="Key points to include">
          <TextArea value={context} onChange={setContext} rows={5} />
        </Field>
      </ToolWorkspace>
    </AppShell>
  );
}
