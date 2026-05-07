import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Copy, Download, RefreshCw, Pencil, Check } from "lucide-react";
import { toast } from "sonner";
import { AIDisclaimer } from "./AIDisclaimer";

interface ResultPanelProps {
  content: string;
  loading?: boolean;
  onRegenerate?: () => void;
  filename?: string;
}

export function ResultPanel({ content, loading, onRegenerate, filename = "flowmate-output.md" }: ResultPanelProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(content);

  useEffect(() => {
    setDraft(content);
  }, [content]);

  const text = editing ? draft : content;

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const download = () => {
    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          Generating with AI…
        </div>
        <div className="mt-4 space-y-2">
          <div className="h-3 w-full animate-pulse rounded bg-muted" />
          <div className="h-3 w-5/6 animate-pulse rounded bg-muted" />
          <div className="h-3 w-4/6 animate-pulse rounded bg-muted" />
        </div>
      </div>
    );
  }

  if (!content) return null;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-foreground">AI Output</h3>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => setEditing((e) => !e)}>
            {editing ? <><Check className="mr-1 h-3.5 w-3.5" />Done</> : <><Pencil className="mr-1 h-3.5 w-3.5" />Edit</>}
          </Button>
          <Button variant="outline" size="sm" onClick={copy}><Copy className="mr-1 h-3.5 w-3.5" />Copy</Button>
          <Button variant="outline" size="sm" onClick={download}><Download className="mr-1 h-3.5 w-3.5" />Export</Button>
          {onRegenerate && (
            <Button variant="outline" size="sm" onClick={onRegenerate}><RefreshCw className="mr-1 h-3.5 w-3.5" />Regenerate</Button>
          )}
        </div>
      </div>
      {editing ? (
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="min-h-[300px] w-full resize-y rounded-lg border border-input bg-background p-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      ) : (
        <div className="prose prose-sm max-w-none text-foreground prose-headings:text-foreground prose-strong:text-foreground prose-a:text-primary">
          <ReactMarkdown>{text}</ReactMarkdown>
        </div>
      )}
      <AIDisclaimer />
    </div>
  );
}