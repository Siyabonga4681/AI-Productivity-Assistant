import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, FileText, ListChecks, Search, MessageSquare, Sparkles, Zap, Shield, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/app/")({
  component: Dashboard,
});

type Tool = { to: string; icon: typeof Mail; title: string; desc: string; gradient?: boolean };
const tools: Tool[] = [
  { to: "/app/email", icon: Mail, title: "Smart Email Generator", desc: "Draft client, manager, or team emails in seconds.", gradient: true },
  { to: "/app/notes", icon: FileText, title: "Meeting Notes Summarizer", desc: "Extract decisions, action items, and deadlines." },
  { to: "/app/planner", icon: ListChecks, title: "Task Planner & Scheduler", desc: "Prioritize with the Eisenhower matrix." },
  { to: "/app/research", icon: Search, title: "Research Assistant", desc: "Distill articles into insights & simple explanations." },
  { to: "/app/chat", icon: MessageSquare, title: "AI Workspace Chat", desc: "Ask anything — your always-on office assistant." },
];

const stats = [
  { icon: Zap, label: "Faster drafts", value: "10×" },
  { icon: TrendingUp, label: "Productivity lift", value: "+38%" },
  { icon: Shield, label: "Reviewable outputs", value: "100%" },
];

function Dashboard() {
  return (
    <div className="space-y-8">
      <header>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4 text-primary" /> Welcome back
        </div>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Your AI workspace
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Five purpose-built assistants to handle the busywork — so you can focus on the decisions that matter.
        </p>
      </header>

      <section className="grid gap-3 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
                <s.icon className="h-4 w-4 text-accent-foreground" />
              </div>
              <div>
                <div className="text-xl font-semibold text-foreground">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {tools.map((t) => (
          <Link
            key={t.to}
            to={t.to as any}
            className="group rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] transition-all hover:shadow-[var(--shadow-soft)] hover:-translate-y-0.5"
          >
            <div
              className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl"
              style={t.gradient ? { background: "var(--gradient-primary)" } : undefined}
            >
              <t.icon className={`h-5 w-5 ${t.gradient ? "text-primary-foreground" : "text-accent-foreground"}`} />
            </div>
            <h3 className="font-semibold text-foreground">{t.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
            <div className="mt-4 text-xs font-medium text-primary group-hover:underline">Open tool →</div>
          </Link>
        ))}
      </section>
    </div>
  );
}