import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { AppShell } from "@/components/AppShell";
import { Field, Select, TextArea, TextInput, ToolWorkspace } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Veridian Work OS" },
      {
        name: "description",
        content:
          "Drop in your task list and get a prioritised, scheduled day plan with focus blocks, estimates and deferred work.",
      },
      { property: "og:title", content: "AI Task Planner — Veridian Work OS" },
      {
        property: "og:description",
        content: "Prioritisation and scheduling for your working day.",
      },
    ],
  }),
  component: PlannerPage,
});

const HOURS = ["09:00 – 17:00", "08:00 – 16:00", "10:00 – 18:00", "Half day (4 hours)"] as const;

function PlannerPage() {
  const [hours, setHours] = useState<string>(HOURS[0]);
  const [constraints, setConstraints] = useState("Deep focus best before noon. Two hours of calls after 15:00.");
  const [tasks, setTasks] = useState(
    "Finalise Q3 pricing deck — due today\nReview onboarding funnel metrics\nReply to Dana about rollout scope\nInterview debrief write-up — due tomorrow\nFix billing export bug — blocking finance",
  );

  return (
    <AppShell title="Task Planner" badge="Tool · 03">
      <ToolWorkspace
        tool="planner"
        heading="Prioritise the day, then schedule it"
        subheading="List what's on your plate — Veridian ranks it and fits it into your hours."
        submitLabel="Plan my day"
        fields={{ hours, constraints, tasks }}
        disabled={tasks.trim().length < 10}
        historyTitle="Day plan"
        historySubtitle={`${hours} · prioritised and scheduled`}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Working hours">
            <Select value={hours} onChange={setHours} options={HOURS} />
          </Field>
          <Field label="Constraints">
            <TextInput value={constraints} onChange={setConstraints} placeholder="Meetings, energy, blockers" />
          </Field>
        </div>
        <Field label="Tasks (one per line, add deadlines if any)">
          <TextArea value={tasks} onChange={setTasks} rows={8} />
        </Field>
      </ToolWorkspace>
    </AppShell>
  );
}
