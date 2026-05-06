import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPTS: Record<string, string> = {
  email: `You are an expert business writing assistant. Generate a polished, professional email based on the user's context, recipient, and tone.
Output ONLY the email content (Subject line on first line as "Subject: ...", then a blank line, then the body). Be concise, clear, and appropriate. End with a brief AI disclaimer comment? No - just the email.`,
  notes: `You are a meeting summarization expert. Given raw meeting notes or a transcript, produce a structured Markdown summary with these exact sections:
## Key Points
## Decisions Made
## Action Items
## Deadlines
Use bullet points. Be concise and accurate. If a section has no content, write "_None identified_".`,
  planner: `You are a productivity planning expert. Given a list of tasks, return Markdown with:
## Prioritized Tasks
A table or list ranked by Eisenhower matrix (Urgent & Important first).
## Suggested Schedule
A daily or weekly time-block schedule.
## Time Optimization Tips
3-5 actionable tips.`,
  research: `You are a research assistant. Given a topic, article, or text, output Markdown with:
## Summary
## Key Insights
## Simple Explanation
Plain-language explanation of complex ideas (ELI15 level).`,
  simplify: `Take the provided text and simplify it further. Use shorter sentences, plainer words, and analogies. Output Markdown.`,
  chat: `You are a friendly, professional AI productivity assistant inside a workplace app. Help with productivity, time management, writing, planning, and workplace questions. Be concise, structured, and use Markdown when helpful.`,
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { mode, messages, input, options } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const system = SYSTEM_PROMPTS[mode] || SYSTEM_PROMPTS.chat;

    let chatMessages: any[];
    if (mode === "chat" && Array.isArray(messages)) {
      chatMessages = [{ role: "system", content: system }, ...messages];
    } else {
      let userContent = input || "";
      if (mode === "email" && options) {
        userContent = `Recipient type: ${options.recipient}\nTone: ${options.tone}\n\nContext:\n${input}`;
      }
      chatMessages = [
        { role: "system", content: system },
        { role: "user", content: userContent },
      ];
    }

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: chatMessages,
      }),
    });

    if (!resp.ok) {
      if (resp.status === 429)
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      if (resp.status === 402)
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds to your Lovable workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      const t = await resp.text();
      console.error("AI gateway error", resp.status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await resp.json();
    const content = data.choices?.[0]?.message?.content ?? "";
    return new Response(JSON.stringify({ content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-assist error", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});