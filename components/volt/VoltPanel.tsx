"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import { canListen, canSpeak, createRecognition, speak, stopSpeaking, warmUpSpeech, type Recognition } from "./speech";

type Role = "bot" | "user";

interface Message {
  id: string;
  role: Role;
  text: string;
  /** A fallback shown when the assistant could not answer; never sent back as history. */
  failed?: boolean;
}

/** What the panel is doing right now; the composer and the status line follow it. */
type Phase = "idle" | "sending" | "listening" | "speaking";

const GREETING =
  "Hi, I'm Power from SoftVolt AI. Tell me what you're working on and I'll show you how we can help, or ask me anything about our services and rates.";
const OFFLINE =
  "Sorry, I couldn't connect just now. You can also send us a brief at softvoltai.com/contact and the team will reply within a business day.";
const SESSION_KEY = "softvolt-volt-session";
const HISTORY_KEY = "softvolt-volt-messages";
/** The assistant runs on a small container, so the first reply after a quiet spell can take a while. */
const TIMEOUT_MS = 60_000;
/** Silent listening turns in a row before voice mode gives up. */
const MAX_SILENCES = 2;

function newId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/** One id per browser, so the assistant remembers the conversation across pages and visits. */
function readSessionId(): string {
  try {
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) return stored;
    const id = newId();
    localStorage.setItem(SESSION_KEY, id);
    return id;
  } catch {
    return newId();
  }
}

function isMessage(value: unknown): value is Message {
  if (!value || typeof value !== "object") return false;
  const m = value as Record<string, unknown>;
  return typeof m.id === "string" && (m.role === "bot" || m.role === "user") && typeof m.text === "string";
}

/** The transcript survives a full page load for the rest of the tab's life. */
function readHistory(): Message[] {
  try {
    const stored: unknown = JSON.parse(sessionStorage.getItem(HISTORY_KEY) ?? "[]");
    if (Array.isArray(stored)) {
      const messages = stored.filter(isMessage).slice(-40);
      if (messages.length) return messages;
    }
  } catch {
    // storage blocked: start fresh
  }
  return [{ id: "greeting", role: "bot", text: GREETING }];
}

/** /api/volt answers `{ output }`; anything else is read defensively. */
function replyText(data: unknown): string {
  if (typeof data === "string") return data;
  if (Array.isArray(data)) return replyText(data[0]);
  if (data && typeof data === "object") {
    const o = data as Record<string, unknown>;
    for (const key of ["output", "text", "message", "response"]) {
      if (typeof o[key] === "string") return o[key] as string;
    }
  }
  return "";
}

export function VoltPanel({ endpoint, open, onClose }: { endpoint: string; open: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>(readHistory);
  const [draft, setDraft] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [voiceMode, setVoiceMode] = useState(false);
  const [speakReplies, setSpeakReplies] = useState(false);
  const [notice, setNotice] = useState("");
  const [supports] = useState(() => ({ listen: canListen(), speak: canSpeak() }));

  const sessionRef = useRef<string>("");
  /** The committed transcript, for building the history a request carries. */
  const messagesRef = useRef<Message[]>(messages);
  const voiceRef = useRef(false);
  const speakRef = useRef(false);
  const recRef = useRef<Recognition | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const silencesRef = useRef(0);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesRef.current = messages;
    try {
      sessionStorage.setItem(HISTORY_KEY, JSON.stringify(messages.slice(-40)));
    } catch {
      // storage blocked: the transcript lasts as long as the page
    }
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => () => {
    recRef.current?.abort();
    abortRef.current?.abort();
    stopSpeaking();
  }, []);

  function stopVoice() {
    voiceRef.current = false;
    setVoiceMode(false);
    const rec = recRef.current;
    recRef.current = null;
    rec?.abort();
    stopSpeaking();
    setPhase((p) => (p === "listening" || p === "speaking" ? "idle" : p));
  }

  async function send(text: string) {
    const said = text.trim();
    if (!said) return;
    setNotice("");
    setDraft("");
    setMessages((m) => [...m, { id: newId(), role: "user", text: said }]);
    setPhase("sending");

    if (!sessionRef.current) sessionRef.current = readSessionId();
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS);

    // the server keeps nothing between messages, so each request carries the conversation so far
    const history = messagesRef.current
      .filter((m) => !m.failed)
      .slice(-16)
      .map((m) => ({ role: m.role === "bot" ? "assistant" : "user", content: m.text }));

    let reply = "";
    let failed = true;
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sessionRef.current, message: said, history }),
        signal: controller.signal,
      });
      const body: unknown = res.headers.get("content-type")?.includes("json") ? await res.json() : await res.text();
      reply = replyText(body).trim();
      failed = !res.ok || !reply;
    } catch {
      reply = "";
    } finally {
      window.clearTimeout(timer);
    }

    const answer = reply || OFFLINE;
    setMessages((m) => [...m, { id: newId(), role: "bot", text: answer, ...(failed ? { failed: true } : {}) }]);

    if (speakRef.current && supports.speak) {
      setPhase("speaking");
      await speak(answer);
    }
    if (voiceRef.current && !failed) listen();
    else setPhase("idle");
  }

  function listen() {
    const rec = createRecognition("en-GB");
    if (!rec) return;
    recRef.current?.abort();
    recRef.current = rec;
    let finalText = "";

    rec.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) finalText += result[0].transcript;
        else interim += result[0].transcript;
      }
      setDraft(`${finalText}${interim}`.trim());
    };
    rec.onerror = (event) => {
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        setNotice("Microphone access is blocked. Allow it in your browser settings, or type your message instead.");
        stopVoice();
      }
    };
    rec.onend = () => {
      if (recRef.current !== rec) return; // stopped on purpose, or replaced by a newer turn
      recRef.current = null;
      const said = finalText.trim();
      if (said) {
        silencesRef.current = 0;
        void send(said);
      } else if (voiceRef.current && silencesRef.current < MAX_SILENCES) {
        silencesRef.current += 1;
        listen();
      } else {
        stopVoice();
      }
    };

    setPhase("listening");
    try {
      rec.start();
    } catch {
      stopVoice();
    }
  }

  function toggleVoice() {
    if (voiceRef.current) {
      stopVoice();
      return;
    }
    warmUpSpeech(); // inside the tap, so Safari will read the replies later
    voiceRef.current = true;
    speakRef.current = true;
    silencesRef.current = 0;
    setVoiceMode(true);
    setSpeakReplies(true);
    setNotice("");
    stopSpeaking();
    listen();
  }

  function toggleSpeaker() {
    const next = !speakRef.current;
    speakRef.current = next;
    setSpeakReplies(next);
    if (!next) stopSpeaking();
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (phase === "sending") return;
    stopSpeaking();
    void send(draft);
  }

  /** Closing always ends a voice conversation: nothing keeps listening behind a closed panel. */
  function close() {
    stopVoice();
    onClose();
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") close();
  }

  const busy = phase === "sending";
  const status =
    phase === "listening"
      ? "Listening… speak now"
      : phase === "speaking"
        ? "Speaking…"
        : phase === "sending"
          ? "Power is typing…"
          : voiceMode
            ? "Voice on"
            : "AI sales assistant · replies in seconds";

  return (
    <div
      role="dialog"
      aria-label="Chat with Power, SoftVolt AI's assistant"
      hidden={!open}
      onKeyDown={onKeyDown}
      className="volt-panel ui fixed inset-0 z-50 flex flex-col overflow-hidden bg-surface text-ink sm:inset-auto sm:bottom-6 sm:right-6 sm:h-[min(620px,calc(100dvh-3rem))] sm:w-[390px] sm:rounded-[var(--radius-xl)] sm:border sm:border-line sm:shadow-2xl"
    >
      <header className="flex items-center gap-3 bg-er-bg px-4 py-3 text-er-ink">
        <span className={cn("volt-orb", phase !== "idle" && "is-active")} aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold leading-tight">Power · SoftVolt AI</p>
          <p className="truncate text-xs text-er-muted" aria-live="polite">
            {status}
          </p>
        </div>
        {supports.speak ? (
          <button
            type="button"
            onClick={toggleSpeaker}
            aria-pressed={speakReplies}
            aria-label={speakReplies ? "Stop reading replies aloud" : "Read replies aloud"}
            title={speakReplies ? "Replies are read aloud" : "Read replies aloud"}
            className="grid h-9 w-9 place-items-center rounded-full border border-er-line text-er-ink transition-colors hover:border-volt hover:text-volt"
          >
            <SpeakerIcon muted={!speakReplies} />
          </button>
        ) : null}
        <button
          type="button"
          onClick={close}
          aria-label="Close chat"
          className="grid h-9 w-9 place-items-center rounded-full border border-er-line text-er-ink transition-colors hover:border-volt hover:text-volt"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        </button>
      </header>

      <div ref={listRef} className="flex flex-1 flex-col gap-3 overflow-y-auto bg-paper px-4 py-4" aria-live="polite">
        {messages.map((m) => (
          <p
            key={m.id}
            className={cn(
              "max-w-[85%] whitespace-pre-line rounded-[var(--radius-lg)] px-3.5 py-2.5 font-sans text-[15px] leading-relaxed",
              m.role === "user"
                ? "self-end rounded-br-[4px] bg-ink text-paper"
                : "self-start rounded-bl-[4px] border border-line bg-surface text-ink",
            )}
          >
            {m.text}
          </p>
        ))}
        {busy ? (
          <p className="volt-typing self-start rounded-[var(--radius-lg)] rounded-bl-[4px] border border-line bg-surface px-3.5 py-3" aria-label="Power is typing">
            <span />
            <span />
            <span />
          </p>
        ) : null}
      </div>

      {notice ? <p className="border-t border-line bg-warn-bg px-4 py-2 text-xs text-warn-fg">{notice}</p> : null}

      <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-line bg-surface p-3">
        {supports.listen ? (
          <button
            type="button"
            onClick={toggleVoice}
            aria-pressed={voiceMode}
            aria-label={voiceMode ? "Stop talking to Power" : "Talk to Power with your voice"}
            title={voiceMode ? "Stop voice" : "Talk with your voice"}
            className={cn(
              "grid h-11 w-11 shrink-0 place-items-center rounded-full transition-colors",
              voiceMode ? "bg-accent text-white" : "border border-line-strong text-ink hover:border-ink",
            )}
          >
            {phase === "listening" ? <span className="volt-bars" aria-hidden="true"><span /><span /><span /><span /></span> : <MicIcon />}
          </button>
        ) : null}
        <label htmlFor="volt-input" className="sr-only">
          Message Power
        </label>
        <input
          id="volt-input"
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={phase === "listening" ? "Listening…" : "Type your message…"}
          autoComplete="off"
          maxLength={1000}
          className="h-11 min-w-0 flex-1 rounded-full border border-line bg-paper px-4 font-sans text-[15px] text-ink outline-none placeholder:text-muted focus:border-ink"
        />
        <button
          type="submit"
          disabled={busy || !draft.trim()}
          aria-label="Send message"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ink text-paper transition-colors hover:bg-ink-hover disabled:cursor-not-allowed disabled:opacity-40"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M2 8h11M9 3.5 13.5 8 9 12.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </form>

      <p className="bg-surface px-4 pb-3 text-[11px] leading-snug text-muted">
        Power is an AI assistant and can make mistakes. What you share is used to answer you and passed to our team if you book.{" "}
        <Link href={site.privacyPath} className="underline underline-offset-2 hover:text-ink">
          Privacy policy
        </Link>
      </p>
    </div>
  );
}

function MicIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <rect x="6.25" y="1.75" width="5.5" height="9" rx="2.75" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3.5 8.5a5.5 5.5 0 0 0 11 0M9 14v2.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function SpeakerIcon({ muted }: { muted: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M2.5 6h2.5l3.5-3v10L5 10H2.5z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      {muted ? (
        <path d="M11 6l3.5 4M14.5 6 11 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      ) : (
        <path d="M11 5.5a3.5 3.5 0 0 1 0 5M12.8 3.8a6 6 0 0 1 0 8.4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      )}
    </svg>
  );
}
