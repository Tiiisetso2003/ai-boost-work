import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import { AppShell } from "@/components/AppShell";
import { ensureFirstThread } from "@/lib/local-store";

export const Route = createFileRoute("/chat/")({
  head: () => ({
    meta: [
      { title: "AI Chat — Veridian Work OS" },
      {
        name: "description",
        content:
          "Chat with your workplace assistant about drafts, plans and decisions. Conversations are kept in this browser.",
      },
      { property: "og:title", content: "AI Chat — Veridian Work OS" },
      {
        property: "og:description",
        content: "A calm workplace assistant for drafts, plans and second opinions.",
      },
    ],
  }),
  component: ChatIndex,
});

function ChatIndex() {
  const navigate = useNavigate();

  useEffect(() => {
    const thread = ensureFirstThread();
    void navigate({ to: "/chat/$threadId", params: { threadId: thread.id }, replace: true });
  }, [navigate]);

  return (
    <AppShell title="Chat" badge="Assistant">
      <div className="p-6 text-[13px] text-muted-foreground">Opening your conversation…</div>
    </AppShell>
  );
}
