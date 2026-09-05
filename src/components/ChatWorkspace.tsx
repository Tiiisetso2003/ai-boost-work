import { useChat } from "@ai-sdk/react";
import { useNavigate } from "@tanstack/react-router";
import { DefaultChatTransport, type UIMessage } from "ai";
import { MessageSquarePlus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { DISCLAIMER } from "@/components/ToolWorkspace";
import {
  createThread,
  deleteThread,
  ensureThread,
  loadThreads,
  persistThreadMessages,
  relativeTime,
  type ChatThread,
} from "@/lib/local-store";

const SUGGESTIONS = [
  "Summarise this week's priorities for my manager",
  "Rewrite my update so it sounds calmer",
  "Help me prepare for a difficult client call",
];

export function ChatWorkspace({ threadId }: { threadId: string }) {
  const navigate = useNavigate();
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [initialMessages, setInitialMessages] = useState<UIMessage[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const thread = ensureThread(threadId);
    setThreads(loadThreads());
    setInitialMessages(thread.messages);
  }, [threadId]);

  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []);

  if (initialMessages === null) {
    return <div className="p-6 text-[13px] text-muted-foreground">Loading your conversations…</div>;
  }

  return (
    <ChatSurface
      key={threadId}
      threadId={threadId}
      initialMessages={initialMessages}
      transport={transport}
      threads={threads}
      error={error}
      setError={setError}
      onThreadsChange={setThreads}
      onNewThread={() => {
        const thread = createThread();
        setThreads(loadThreads());
        void navigate({ to: "/chat/$threadId", params: { threadId: thread.id } });
      }}
      onSelectThread={(id) => void navigate({ to: "/chat/$threadId", params: { threadId: id } })}
    />
  );
}

function ChatSurface({
  threadId,
  initialMessages,
  transport,
  threads,
  error,
  setError,
  onThreadsChange,
  onNewThread,
  onSelectThread,
}: {
  threadId: string;
  initialMessages: UIMessage[];
  transport: DefaultChatTransport<UIMessage>;
  threads: ChatThread[];
  error: string | null;
  setError: (v: string | null) => void;
  onThreadsChange: (threads: ChatThread[]) => void;
  onNewThread: () => void;
  onSelectThread: (id: string) => void;
}) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const { messages, sendMessage, status } = useChat({
    id: threadId,
    messages: initialMessages,
    transport,
    onError: (e) =>
      setError(e.message || "The assistant is unavailable right now. Please try again."),
  });

  useEffect(() => {
    if (status === "ready" || status === "error") {
      persistThreadMessages(threadId, messages);
      onThreadsChange(loadThreads());
    }
  }, [messages, status, threadId, onThreadsChange]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, [threadId, status]);

  const busy = status === "submitted" || status === "streaming";

  const submit = useCallback(
    (text: string) => {
      const value = text.trim();
      if (!value || busy) return;
      setError(null);
      setInput("");
      void sendMessage({ text: value });
    },
    [busy, sendMessage, setError],
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 p-4 sm:p-6 lg:flex-row">
      {/* Threads */}
      <div className="w-full shrink-0 rounded-2xl bg-panel p-3 ring-1 ring-line lg:w-64">
        <div className="flex items-center justify-between px-1 pb-2">
          <p className="label-mono">Conversations</p>
          <button
            onClick={onNewThread}
            aria-label="New conversation"
            className="grid size-7 place-items-center rounded-lg text-acc ring-1 ring-line transition hover:bg-acc/10"
          >
            <MessageSquarePlus className="size-3.5" />
          </button>
        </div>
        <ul className="max-h-56 space-y-1 overflow-y-auto lg:max-h-[calc(100vh-14rem)]">
          {threads.map((thread) => {
            const active = thread.id === threadId;
            return (
              <li
                key={thread.id}
                className={`group flex items-center gap-1 rounded-lg px-2 py-2 transition ${
                  active ? "bg-panel2 ring-1 ring-line" : "hover:bg-panel2/60"
                }`}
              >
                <button
                  onClick={() => onSelectThread(thread.id)}
                  className="min-w-0 flex-1 text-left"
                >
                  <p
                    className={`truncate text-[13px] font-medium ${active ? "text-foreground" : "text-muted-foreground"}`}
                  >
                    {thread.title}
                  </p>
                  <p className="font-mono text-[10px] text-muted-foreground">
                    {relativeTime(thread.updatedAt)}
                  </p>
                </button>
                <button
                  aria-label="Delete conversation"
                  onClick={() => {
                    const next = deleteThread(thread.id);
                    onThreadsChange(next);
                    if (active) {
                      const fallback = next[0] ?? createThread();
                      onSelectThread(fallback.id);
                    }
                  }}
                  className="shrink-0 rounded-md p-1 text-muted-foreground opacity-0 transition group-hover:opacity-100 hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Chat */}
      <section className="flex min-h-[70vh] min-w-0 flex-1 flex-col rounded-2xl bg-panel ring-1 ring-line">
        <Conversation className="flex-1">
          <ConversationContent className="px-4 py-5 sm:px-6">
            {messages.length === 0 && (
              <div className="animate-rise py-10 text-center">
                <div className="mx-auto grid size-11 place-items-center rounded-xl bg-acc font-display text-lg font-bold text-background shadow-lg shadow-acc/10">
                  V
                </div>
                <h2 className="mt-4 font-display text-[20px] font-bold tracking-tight">
                  What are we getting off your plate?
                </h2>
                <p className="mt-1 text-[13px] text-muted-foreground">
                  Ask for a draft, a summary, a plan, or a second opinion.
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => submit(s)}
                      className="rounded-full bg-panel2 px-3 py-1.5 text-[12px] text-muted-foreground ring-1 ring-line transition hover:text-foreground hover:ring-acc/30"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message) => (
              <Message key={message.id} from={message.role}>
                <MessageContent>
                  {message.parts.map((part, i) =>
                    part.type === "text" ? (
                      <MessageResponse key={i} className="text-[13px] leading-relaxed">
                        {part.text}
                      </MessageResponse>
                    ) : null,
                  )}
                </MessageContent>
              </Message>
            ))}

            {status === "submitted" && (
              <Message from="assistant">
                <MessageContent>
                  <Shimmer className="text-[13px]">Thinking…</Shimmer>
                </MessageContent>
              </Message>
            )}

            {error && <p className="mt-2 text-[13px] text-destructive">{error}</p>}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <div className="border-t border-line p-4 sm:p-5">
          <PromptInput
            onSubmit={(_message, event) => {
              event.preventDefault();
              submit(input);
            }}
          >
            <PromptInputTextarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Veridian to draft, summarise or plan something…"
            />
            <PromptInputFooter className="justify-end">
              <PromptInputSubmit status={status} disabled={busy || input.trim().length === 0} />
            </PromptInputFooter>
          </PromptInput>
          <p className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span className="size-3 rounded-full ring-1 ring-line" aria-hidden />
            {DISCLAIMER}
          </p>
        </div>
      </section>
    </div>
  );
}
