import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileText, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { callAI } from "@/lib/ai";
import { ResultPanel } from "@/components/ResultPanel";

export const Route = createFileRoute("/app/notes")({ component: NotesPage });

const SAMPLE = `Standup 10am — Q3 launch sync. Alice: marketing site is 80% done, blocked on hero copy from Sam. Sam will deliver by Wed EOD. Bob: backend API ready but rate limits need tuning before launch — owner Bob, by Friday. Decided to push public launch to Sept 12 (was Sept 8) due to security review. Action: Priya to draft customer email for the date change by Tue. Risk: legal review still pending.`;

function NotesPage() {
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (notes.trim().length < 30) {
      toast.error("Paste at least a paragraph of meeting notes.");
      return;
    }
    setLoading(true);
    setOutput("");
    try {
      const content = await callAI({ mode: "notes", input: notes });
      setOutput(content);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to summarize");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
          <FileText className="h-5 w-5 text-accent-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Meeting Notes Summarizer</h1>
          <p className="text-sm text-muted-foreground">Turn raw notes into key points, decisions, action items, and deadlines.</p>
        </div>
      </header>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Meeting notes or transcript</Label>
            <Button variant="ghost" size="sm" onClick={() => setNotes(SAMPLE)}>Use sample</Button>
          </div>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Paste your meeting transcript or rough notes…"
            className="min-h-[220px]"
          />
        </div>
        <Button onClick={generate} disabled={loading}>
          <Sparkles className="mr-2 h-4 w-4" /> {loading ? "Summarizing…" : "Summarize"}
        </Button>
      </div>

      <ResultPanel content={output} loading={loading} onRegenerate={generate} filename="meeting-summary.md" />
    </div>
  );
}