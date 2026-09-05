import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { AppShell } from "@/components/AppShell";
import { Field, TextArea, TextInput, ToolWorkspace } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Veridian Work OS" },
      {
        name: "description",
        content:
          "Turn messy meeting notes or a transcript into key points, owners, action items and deadlines your team can act on.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer — Veridian Work OS" },
      {
        property: "og:description",
        content: "Key points, action items with owners, and deadlines from raw meeting notes.",
      },
    ],
  }),
  component: NotesPage,
});

function NotesPage() {
  const [title, setTitle] = useState("Q3 planning sync");
  const [attendees, setAttendees] = useState("Dana K., Marcus L., Priya S.");
  const [notes, setNotes] = useState(
    "Dana walked through the Q3 rollout. Dashboard + reporting ship week 4, admin console slips to Q4. Marcus flagged the payment migration risk. Legal still holds MSA redlines - Priya chasing, wants them Friday EOD. UAT opens Mar 18, QA sign-off needed Mar 21. Finance to send migration cost estimate end of week.",
  );

  return (
    <AppShell title="Meeting Notes" badge="Tool · 02">
      <ToolWorkspace
        tool="notes"
        heading="Turn raw notes into decisions and owners"
        subheading="Paste notes or a transcript — get key points, actions and deadlines."
        submitLabel="Summarize notes"
        fields={{ title, attendees, notes }}
        disabled={notes.trim().length < 20}
        historyTitle={title.trim() || "Meeting summary"}
        historySubtitle="Key points · actions · deadlines"
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Meeting title">
            <TextInput value={title} onChange={setTitle} placeholder="Weekly product sync" />
          </Field>
          <Field label="Attendees">
            <TextInput value={attendees} onChange={setAttendees} placeholder="Names, comma separated" />
          </Field>
        </div>
        <Field label="Raw notes or transcript">
          <TextArea value={notes} onChange={setNotes} rows={9} />
        </Field>
      </ToolWorkspace>
    </AppShell>
  );
}
