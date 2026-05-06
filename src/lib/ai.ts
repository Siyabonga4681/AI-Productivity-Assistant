import { supabase } from "@/integrations/supabase/client";

export type AIMode = "email" | "notes" | "planner" | "research" | "simplify" | "chat";

export async function callAI(payload: {
  mode: AIMode;
  input?: string;
  messages?: { role: "user" | "assistant"; content: string }[];
  options?: Record<string, string>;
}): Promise<string> {
  const { data, error } = await supabase.functions.invoke("ai-assist", { body: payload });
  if (error) throw new Error(error.message || "AI request failed");
  if (data?.error) throw new Error(data.error);
  return data?.content ?? "";
}