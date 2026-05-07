import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { callAI } from "@/lib/ai";
import { AIDisclaimer } from "@/components/AIDisclaimer";

export const Route = createFileRoute("/app/chat")({ component: ChatPage });

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "How do I prioritize 12 tasks for tomorrow?",
  "Write a 3-line apology to a client for a missed deadline.",
  "Tips to run a great 25-minute standup.",
];

function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "👋 Hi! I'm your AI workspace assistant. Ask me anything about productivity, writing, planning, or workplace tasks." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content) return;
    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const reply = await callAI({ mode: "chat", messages: next });
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to reply");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <header className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: "var(--gradient-primary)" }}>
          <MessageSquare className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Workspace Chat</h1>
          <p className="text-sm text-muted-foreground">Your always-on assistant for any workplace question.</p>
        </div>
      </header>

      <div className="rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] flex flex-col h-[calc(100vh-16rem)] min-h-[420px]">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                {m.role === "assistant" ? (
                  <div className="prose prose-sm max-w-none text-foreground prose-headings:text-foreground prose-strong:text-foreground prose-a:text-primary prose-p:my-1">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap">{m.content}</p>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-muted px-4 py-3 text-sm text-muted-foreground flex items-center gap-2">
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" /> Thinking…
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {messages.length <= 1 && (
          <div className="px-4 sm:px-6 pb-2 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-accent-foreground transition"
              >
                <Sparkles className="inline h-3 w-3 mr-1" />{s}
              </button>
            ))}
          </div>
        )}

        <form
          onSubmit={(e) => { e.preventDefault(); send(); }}
          className="border-t border-border p-3 flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything…"
            disabled={loading}
          />
          <Button type="submit" disabled={loading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
      <AIDisclaimer />
    </div>
  );
}