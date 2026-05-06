import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Sparkles, Mail, FileText, ListChecks, Search, MessageSquare, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FlowMate — AI Workplace Productivity Assistant" },
      { name: "description", content: "Automate emails, summarize meetings, plan tasks, and research faster with your AI workplace assistant." },
    ],
  }),
  component: Index,
});

const features = [
  { icon: Mail, title: "Smart Emails", desc: "Draft polished emails in seconds." },
  { icon: FileText, title: "Notes Summarizer", desc: "Turn transcripts into action items." },
  { icon: ListChecks, title: "Task Planner", desc: "Prioritize and schedule your day." },
  { icon: Search, title: "Research Assistant", desc: "Distill any topic into key insights." },
  { icon: MessageSquare, title: "AI Chat", desc: "Ask anything, get expert answers." },
];

function Index() {
  return (
    <div className="min-h-screen" style={{ background: "var(--gradient-soft)" }}>
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: "var(--gradient-primary)" }}>
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold">FlowMate</span>
        </div>
        <Button asChild>
          <Link to="/app">Open App <ArrowRight className="ml-1 h-4 w-4" /></Link>
        </Button>
      </header>

      <main className="mx-auto max-w-6xl px-6 pt-12 pb-24">
        <section className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-[var(--shadow-card)]">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Your AI workplace assistant
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Work smarter,
            <span className="block bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-primary)" }}>
              not harder.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            Draft emails, summarize meetings, plan tasks, and research topics — all in one calm, focused workspace.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/app">Get Started <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </section>

        <section className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] transition-all hover:shadow-[var(--shadow-soft)] hover:-translate-y-0.5">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                <f.icon className="h-5 w-5 text-accent-foreground" />
              </div>
              <h3 className="mb-1 font-semibold text-foreground">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
