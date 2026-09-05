import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/AppShell";
import { ChatWorkspace } from "@/components/ChatWorkspace";

export const Route = createFileRoute("/chat/$threadId")({
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
  component: ChatThreadPage,
});

function ChatThreadPage() {
  const { threadId } = Route.useParams();

  return (
    <AppShell title="Chat" badge="Assistant">
      <div className="flex min-h-[calc(100vh-4rem)] flex-col">
        <ChatWorkspace threadId={threadId} />
      </div>
    </AppShell>
  );
}
