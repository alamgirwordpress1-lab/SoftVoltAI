/**
 * Voice for Volt, using only what the browser already has: the Web Speech API
 * turns the visitor's voice into text (Chrome, Edge and Safari) and reads the
 * replies aloud. Nothing is installed and no speech service is paid for — a
 * browser without it simply gets the text chat.
 */

interface RecognitionAlternative {
  transcript: string;
}

interface RecognitionResult {
  isFinal: boolean;
  0: RecognitionAlternative;
}

export interface RecognitionEvent {
  resultIndex: number;
  results: ArrayLike<RecognitionResult>;
}

export interface Recognition {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  onresult: ((event: RecognitionEvent) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

type RecognitionCtor = new () => Recognition;

function recognitionCtor(): RecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function canListen(): boolean {
  return recognitionCtor() !== null;
}

export function canSpeak(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window && typeof SpeechSynthesisUtterance !== "undefined";
}

/** One listening turn: it ends by itself after the visitor stops talking. */
export function createRecognition(lang = "en-GB"): Recognition | null {
  const Ctor = recognitionCtor();
  if (!Ctor) return null;
  const rec = new Ctor();
  rec.lang = lang;
  rec.interimResults = true;
  rec.continuous = false;
  rec.maxAlternatives = 1;
  return rec;
}

/** A British voice when the system has one, then any English voice. */
function englishVoice(): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => v.lang === "en-GB" && /female|google|natural/i.test(v.name)) ??
    voices.find((v) => v.lang === "en-GB") ??
    voices.find((v) => v.lang.startsWith("en"))
  );
}

/**
 * Safari only lets a page speak after a tap, so the first tap on the
 * microphone speaks nothing once to unlock it for the replies that follow.
 */
export function warmUpSpeech() {
  if (!canSpeak()) return;
  const u = new SpeechSynthesisUtterance("");
  u.volume = 0;
  window.speechSynthesis.speak(u);
}

export function stopSpeaking() {
  if (canSpeak()) window.speechSynthesis.cancel();
}

/**
 * Reads a reply aloud and resolves when it has finished (or was cancelled).
 * Sentences are queued one by one: Chrome cuts off a single long utterance
 * after about fifteen seconds.
 */
export function speak(text: string): Promise<void> {
  if (!canSpeak() || !text.trim()) return Promise.resolve();
  const synth = window.speechSynthesis;
  synth.cancel();
  const voice = englishVoice();
  const sentences = text.match(/[^.!?]+[.!?]*\s*/g) ?? [text];
  return new Promise((resolve) => {
    let left = sentences.length;
    const done = () => {
      left -= 1;
      if (left <= 0) resolve();
    };
    for (const sentence of sentences) {
      const u = new SpeechSynthesisUtterance(sentence.trim());
      u.lang = voice?.lang ?? "en-GB";
      if (voice) u.voice = voice;
      u.rate = 1.03;
      u.onend = done;
      u.onerror = done;
      synth.speak(u);
    }
  });
}
