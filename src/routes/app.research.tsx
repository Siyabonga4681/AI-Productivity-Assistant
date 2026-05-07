import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Search, Sparkles, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { callAI } from "@/lib/ai";
import { ResultPanel } from "@/components/ResultPanel";

export const Route = createFileRoute("/app/research")({ component: ResearchPage });

function ResearchPage() {
  const [topic, setTopic] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [simplifying, setSimplifying] = useState(false);

  const generate = async () => {
    if (topic.trim().length < 5) {
      toast.error("Enter a topic, article, or paragraph to research.");
      return;
    }
    setLoading(true);
    setOutput("");
    try {
      const content = await callAI({ mode: "research", input: topic });
      setOutput(content);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to research");
    } finally {
      setLoading(false);
    }
  };

  const simplify = async () => {
    if (!output) return;
    setSimplifying(true);
    try {
      const content = await callAI({ mode: "simplify", input: output });
      setOutput(content);
      toast.success("Simplified further");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to simplify");
    } finally {
      setSimplifying(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
          <Search className="h-5 w-5 text-accent-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Research Assistant</h1>
          <p className="text-sm text-muted-foreground">Summarize topics, surface insights, and explain complex ideas simply.</p>
        </div>
      </header>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] space-y-4">
        <div className="space-y-2">
          <Label>Topic, article, or paragraph</Label>
          <Textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Explain how vector databases work and where they're used in modern AI products."
            className="min-h-[160px]"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={generate} disabled={loading}>
            <Sparkles className="mr-2 h-4 w-4" /> {loading ? "Researching…" : "Generate Summary"}
          </Button>
          {output && (
            <Button variant="outline" onClick={simplify} disabled={simplifying}>
              <Wand2 className="mr-2 h-4 w-4" /> {simplifying ? "Simplifying…" : "Simplify Further"}
            </Button>
          )}
        </div>
      </div>

      <ResultPanel content={output} loading={loading || simplifying} onRegenerate={generate} filename="research.md" />
    </div>
  );
}