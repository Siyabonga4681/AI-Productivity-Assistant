import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ListChecks, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { callAI } from "@/lib/ai";
import { ResultPanel } from "@/components/ResultPanel";

export const Route = createFileRoute("/app/planner")({ component: PlannerPage });

function PlannerPage() {
  const [tasks, setTasks] = useState("");
  const [horizon, setHorizon] = useState("day");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (tasks.trim().length < 10) {
      toast.error("List at least one task with some detail.");
      return;
    }
    setLoading(true);
    setOutput("");
    try {
      const content = await callAI({
        mode: "planner",
        input: `Planning horizon: ${horizon}\n\nTasks:\n${tasks}`,
      });
      setOutput(content);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
          <ListChecks className="h-5 w-5 text-accent-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Task Planner & Scheduler</h1>
          <p className="text-sm text-muted-foreground">Prioritize, schedule, and optimize your day or week.</p>
        </div>
      </header>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] space-y-4">
        <div className="space-y-2 max-w-xs">
          <Label>Plan for</Label>
          <Select value={horizon} onValueChange={setHorizon}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Today</SelectItem>
              <SelectItem value="week">This week</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Your tasks (one per line)</Label>
          <Textarea
            value={tasks}
            onChange={(e) => setTasks(e.target.value)}
            placeholder={"Finalize Q3 report (due Fri)\nReply to client emails\nPrepare slides for Tuesday demo\nGym\n1:1 with manager"}
            className="min-h-[200px]"
          />
        </div>
        <Button onClick={generate} disabled={loading}>
          <Sparkles className="mr-2 h-4 w-4" /> {loading ? "Planning…" : "Build my plan"}
        </Button>
      </div>

      <ResultPanel content={output} loading={loading} onRegenerate={generate} filename="plan.md" />
    </div>
  );
}