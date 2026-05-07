import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { callAI } from "@/lib/ai";
import { ResultPanel } from "@/components/ResultPanel";

export const Route = createFileRoute("/app/email")({ component: EmailPage });

function EmailPage() {
  const [context, setContext] = useState("");
  const [recipient, setRecipient] = useState("client");
  const [tone, setTone] = useState("formal");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (context.trim().length < 10) {
      toast.error("Please add at least a sentence of context.");
      return;
    }
    setLoading(true);
    setOutput("");
    try {
      const content = await callAI({ mode: "email", input: context, options: { recipient, tone } });
      setOutput(content);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to generate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: "var(--gradient-primary)" }}>
          <Mail className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Smart Email Generator</h1>
          <p className="text-sm text-muted-foreground">Draft a polished email tailored to your audience and tone.</p>
        </div>
      </header>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Recipient</Label>
            <Select value={recipient} onValueChange={setRecipient}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="client">Client</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="colleague">Colleague / Team</SelectItem>
                <SelectItem value="recruiter">Recruiter</SelectItem>
                <SelectItem value="vendor">Vendor / Partner</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Tone</Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="formal">Formal</SelectItem>
                <SelectItem value="informal">Informal / Friendly</SelectItem>
                <SelectItem value="persuasive">Persuasive</SelectItem>
                <SelectItem value="apologetic">Apologetic</SelectItem>
                <SelectItem value="appreciative">Appreciative</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Context / what you want to say</Label>
          <Textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="e.g. Follow up with the client about the Q3 proposal sent last week, ask about feedback and propose a 30-min call."
            className="min-h-[140px]"
          />
        </div>
        <Button onClick={generate} disabled={loading} className="w-full sm:w-auto">
          <Sparkles className="mr-2 h-4 w-4" /> {loading ? "Generating…" : "Generate Email"}
        </Button>
      </div>

      <ResultPanel content={output} loading={loading} onRegenerate={generate} filename="email.md" />
    </div>
  );
}