import { VOLT_SYSTEM_PROMPT } from "./prompt";

/**
 * Volt's brain runs here, on the site's own server: one DeepSeek chat call per
 * visitor message, plus a second when the model uses a tool. A booking or a
 * hand-off goes to the n8n "Lead handler" webhook, which saves it and alerts
 * the admin (Telegram and email). n8n itself stays small — its 512 MB
 * container was killed for memory running the whole agent — so it only ever
 * receives finished leads.
 */

export type Turn = { role: "user" | "assistant"; content: string };

type ToolName = "book_service" | "handoff_to_human";

interface ToolCall {
  id: string;
  type: "function";
  function: { name: string; arguments: string };
}

interface AssistantMessage {
  role: "assistant";
  content: string | null;
  tool_calls?: ToolCall[];
  reasoning_content?: string;
}

type ChatMessage =
  | { role: "system" | "user"; content: string }
  | AssistantMessage
  | { role: "tool"; tool_call_id: string; content: string };

const API_URL = "https://api.deepseek.com/chat/completions";
const MAX_TOOL_ROUNDS = 3;

const leadProperties = {
  name: { type: "string", description: "Full name of the visitor" },
  email: { type: "string", description: "Email address of the visitor" },
  phone: { type: "string", description: "Phone or WhatsApp number, or an empty string if not given" },
  company: { type: "string", description: "Agency or company name, or an empty string if not given" },
  services: { type: "string", description: "The SoftVolt service or services they want, plus the plan if they chose one" },
  details: { type: "string", description: "What the project is, in a sentence or two" },
  budget: { type: "string", description: "Their budget or chosen plan, or 'not given'" },
  timeline: { type: "string", description: "When they need it, or 'not given'" },
  summary: { type: "string", description: "A short note for the admin about this visitor" },
} as const;

const TOOLS = [
  {
    type: "function",
    function: {
      name: "book_service",
      description:
        "Books the visitor's order with SoftVolt AI and alerts the admin. Call it once, only after the visitor has confirmed their details: at least name, email, the service or services, and what the project is.",
      parameters: {
        type: "object",
        properties: leadProperties,
        required: ["name", "email", "services", "details", "summary"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "handoff_to_human",
      description:
        "Hands the visitor to a SoftVolt human expert and alerts the admin as a hot lead. Use it when the visitor wants a person, is still unsure after you answered honestly, or asks something you cannot answer. Needs at least name and email. In summary, say what they want, what you explained or offered, and why they want a human.",
      parameters: {
        type: "object",
        properties: leadProperties,
        required: ["name", "email", "summary"],
      },
    },
  },
] as const;

export class VoltUnavailableError extends Error {}

/** How the n8n Lead handler's reply starts when it saved a lead (see its "Reply to Volt" node). */
const SAVED_PREFIX = { booking: "Booking saved", hot_lead: "Handed to a human expert" } as const;

/** Said to the visitor when a lead is saved but the model's follow-up could not be fetched. */
const BOOKED =
  "Thank you, your booking is saved. The SoftVolt team will reply within 1 business day and send a written scope and fixed price within 2 business days, and nothing starts until you approve it.";
const HANDED_OFF = "Thank you. A SoftVolt expert has your details and will contact you within 1 business day.";

function text(value: unknown, max = 2000): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Sends a finished lead to n8n and returns what the model should be told. */
async function saveLead(kind: "booking" | "hot_lead", rawArgs: string, sessionId: string): Promise<string> {
  let args: Record<string, unknown>;
  try {
    args = JSON.parse(rawArgs) as Record<string, unknown>;
  } catch {
    return "The details could not be read. Ask the visitor to repeat their name and email.";
  }
  const lead = {
    kind,
    name: text(args.name, 120),
    email: text(args.email, 160),
    phone: text(args.phone, 40),
    company: text(args.company, 120),
    services: text(args.services, 300),
    details: text(args.details, 2000),
    budget: text(args.budget, 120) || "not given",
    timeline: text(args.timeline, 120) || "not given",
    summary: text(args.summary, 2000),
    session_id: sessionId,
  };
  if (!lead.name || !EMAIL.test(lead.email)) {
    return "The name or email address is missing or looks wrong. Ask the visitor to check it, then try again.";
  }

  const url = process.env.VOLT_LEADS_WEBHOOK_URL;
  if (!url) {
    console.error("[volt] VOLT_LEADS_WEBHOOK_URL is not set; lead not saved", { kind, session: sessionId });
    return "Saving failed.";
  }
  const secret = process.env.VOLT_LEADS_WEBHOOK_SECRET;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(secret ? { "x-volt-secret": secret } : {}) },
      body: JSON.stringify(lead),
      // n8n runs on a small container; a first request after a quiet spell is slow
      signal: AbortSignal.timeout(25_000),
    });
    if (!res.ok) throw new Error(`n8n answered ${res.status}`);
    const data = (await res.json().catch(() => ({}))) as { result?: unknown };
    return typeof data.result === "string" && data.result ? data.result : "Saved. The SoftVolt team has been alerted.";
  } catch (err) {
    console.error("[volt] lead webhook failed", { kind, session: sessionId, error: String(err) });
    return "Saving failed.";
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function complete(messages: ChatMessage[], withThinkingSwitch = true, attempt = 0): Promise<AssistantMessage> {
  const key = process.env.DEEPSEEK_API_KEY;
  if (!key) throw new VoltUnavailableError("DEEPSEEK_API_KEY is not set");

  let res: Response;
  try {
    res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: process.env.DEEPSEEK_MODEL || "deepseek-v4-pro",
        messages,
        tools: TOOLS,
        tool_choice: "auto",
        temperature: 0.6,
        max_tokens: 700,
        stream: false,
        // a sales chat wants a quick answer, not minutes of reasoning
        ...(withThinkingSwitch ? { thinking: { type: "disabled" } } : {}),
      }),
      signal: AbortSignal.timeout(40_000),
    });
  } catch (err) {
    // a dropped connection (ECONNRESET and the like) fails fast and usually works on a second try;
    // a timeout has already used most of the time a reply may take, so it is not retried
    const timedOut = err instanceof Error && (err.name === "TimeoutError" || err.name === "AbortError");
    if (!timedOut && attempt < 2) {
      await sleep(700 * (attempt + 1));
      return complete(messages, withThinkingSwitch, attempt + 1);
    }
    throw new VoltUnavailableError(`DeepSeek unreachable: ${String(err)}`);
  }

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    // a model that does not know the thinking switch rejects it; ask once more without it
    if (withThinkingSwitch && res.status === 400 && /thinking/i.test(detail)) return complete(messages, false, attempt);
    if ((res.status === 429 || res.status >= 500) && attempt < 2) {
      await sleep(1000 * (attempt + 1));
      return complete(messages, withThinkingSwitch, attempt + 1);
    }
    throw new VoltUnavailableError(`DeepSeek answered ${res.status}: ${detail.slice(0, 300)}`);
  }
  const data = (await res.json()) as { choices?: { message?: AssistantMessage }[] };
  const message = data.choices?.[0]?.message;
  if (!message) throw new VoltUnavailableError("DeepSeek sent no message");
  return message;
}

/** One visitor message in, one reply out (after any tool calls). */
export async function voltReply(history: Turn[], message: string, sessionId: string): Promise<string> {
  const messages: ChatMessage[] = [
    { role: "system", content: VOLT_SYSTEM_PROMPT },
    ...history.map((t) => ({ role: t.role, content: t.content })),
    { role: "user", content: message },
  ];

  // what was saved in this message's tool rounds, so a failed follow-up call never hides a saved lead
  let saved: "booking" | "hot_lead" | null = null;

  for (let round = 0; round <= MAX_TOOL_ROUNDS; round++) {
    let reply: AssistantMessage;
    try {
      reply = await complete(messages);
    } catch (err) {
      if (saved === "booking") return BOOKED;
      if (saved === "hot_lead") return HANDED_OFF;
      throw err;
    }
    const calls = reply.tool_calls ?? [];
    if (!calls.length || round === MAX_TOOL_ROUNDS) return (reply.content ?? "").trim();

    // the tool round keeps the model's own message (and any reasoning) so the follow-up call has the full context
    messages.push({ role: "assistant", content: reply.content ?? "", tool_calls: calls, ...(reply.reasoning_content ? { reasoning_content: reply.reasoning_content } : {}) });
    for (const call of calls) {
      const name = call.function?.name as ToolName;
      const kind = name === "book_service" ? "booking" : name === "handoff_to_human" ? "hot_lead" : null;
      const result = kind ? await saveLead(kind, call.function.arguments, sessionId) : "Unknown tool.";
      if (kind && result.startsWith(SAVED_PREFIX[kind])) saved = kind;
      messages.push({ role: "tool", tool_call_id: call.id, content: result });
    }
  }
  return "";
}
