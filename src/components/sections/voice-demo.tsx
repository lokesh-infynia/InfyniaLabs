"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Mic, MicOff, PhoneOff, Volume2, Loader2,
  FileSpreadsheet, ArrowRight, BarChart3, Phone,
  CheckCircle2, XCircle, Clock, Sparkles,
} from "lucide-react";

// ─── Config (set via .env.local) ──────────────────────────────────────────────
const RAW_BACKEND_WS = process.env.NEXT_PUBLIC_VOICE_BACKEND_WS_URL;
const RAW_BACKEND_HTTP = process.env.NEXT_PUBLIC_VOICE_BACKEND_HTTP_URL;
const BACKEND_HTTP = RAW_BACKEND_HTTP ?? "http://localhost:8000";

// Compute a safe WS URL depending on whether the page is served over HTTPS.
function normalizeWsUrl(rawWs?: string | undefined, httpFallback?: string) {
  // Client-side: prefer secure wss when the page is HTTPS.
  if (typeof window !== "undefined") {
    const isHttpsPage = window.location.protocol === "https:";
    if (rawWs) {
      if (isHttpsPage && rawWs.startsWith("ws://")) {
        return rawWs.replace(/^ws:/, "wss:");
      }
      return rawWs;
    }
    if (httpFallback) {
      // Derive ws/wss from http/https
      if (isHttpsPage) return httpFallback.replace(/^http:/, "wss:").replace(/^https:/, "wss:");
      return httpFallback.replace(/^https:/, "ws:").replace(/^http:/, "ws:");
    }
    return isHttpsPage ? "wss://localhost:8000" : "ws://localhost:8000";
  }

  // Server-side: use rawWs or derive a ws:// from http fallback.
  if (rawWs) return rawWs;
  if (httpFallback) return httpFallback.replace(/^https?:/, "ws:");
  return "ws://localhost:8000";
}

const BACKEND_WS = normalizeWsUrl(RAW_BACKEND_WS, RAW_BACKEND_HTTP);
const DEMO_CUSTOMER_ID = process.env.NEXT_PUBLIC_DEMO_CUSTOMER_ID  ?? "";
const DEMO_CAMPAIGN_ID = process.env.NEXT_PUBLIC_DEMO_CAMPAIGN_ID  ?? "Bike insurance Renew Interest";

// ─── Audio helpers (ported from VoiceCallModal) ───────────────────────────────
const TARGET_PCM_RATE   = 16_000;
const MIC_RMS_THRESHOLD = 0.0002;
const BARGE_IN_RMS_THRESHOLD   = 0.02;
const BARGE_IN_REQUIRED_FRAMES = 12;
const BARGE_IN_MIN_AGENT_MS    = 500;
const BARGE_IN_COOLDOWN_MS     = 2000;
const AGENT_PLAYBACK_GRACE_MS  = 250;

function encodeAndDecimate(float32: Float32Array, ctxRate: number, target: number): ArrayBuffer {
  const factor = Math.max(1, Math.round(ctxRate / target));
  const out = new Int16Array(Math.floor(float32.length / factor));
  for (let i = 0; i < out.length; i++) {
    const s = float32[i * factor];
    out[i] = Math.max(-32768, Math.min(32767, Math.round(s * 32768)));
  }
  return out.buffer;
}

function rmsEnergy(s: Float32Array) {
  if (!s.length) return 0;
  let sum = 0;
  for (let i = 0; i < s.length; i++) sum += s[i] * s[i];
  return Math.sqrt(sum / s.length);
}

// ─── Intent colours ───────────────────────────────────────────────────────────
const INTENT_LABELS: Record<string, string> = {
  confirmed:          "Interested",
  callback_requested: "Call Back",
  not_interested:     "Not Interested",
  objection_price:    "Price Objection",
  in_progress:        "In Progress",
  already_renewed:    "Already Renewed",
  complaint:          "Complaint",
};

const INTENT_COLORS: Record<string, string> = {
  confirmed:          "text-green-400",
  callback_requested: "text-yellow-400",
  not_interested:     "text-red-400",
  objection_price:    "text-orange-400",
  in_progress:        "text-white/60",
};

// ─── Workflow step data ────────────────────────────────────────────────────────
const WORKFLOW_STEPS = [
  {
    icon: FileSpreadsheet,
    title: "Dealer Uploads Excel",
    desc: "Customer list with bike details, policy expiry dates, contact numbers",
    color: "from-blue-500/20 to-blue-500/5",
    border: "border-blue-500/30",
    iconColor: "text-blue-400",
  },
  {
    icon: Phone,
    title: "AI Agent Calls",
    desc: "Priya calls each customer in Hindi, explains renewal options, handles objections",
    color: "from-accent/20 to-accent/5",
    border: "border-accent/30",
    iconColor: "text-accent",
  },
  {
    icon: BarChart3,
    title: "Data Back to Dealer",
    desc: "Interest level, competitor info, feedback, callback time — all structured",
    color: "from-green-500/20 to-green-500/5",
    border: "border-green-500/30",
    iconColor: "text-green-400",
  },
];

// ─── Demo Call Component ──────────────────────────────────────────────────────
type CallStatus = "idle" | "connecting" | "active" | "ended" | "error";

function DemoCallUI() {
  const [status, setStatus]       = useState<CallStatus>("idle");
  const [callId, setCallId]       = useState<string | null>(null);
  const [elapsed, setElapsed]     = useState(0);
  const [muted, setMuted]         = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [intent, setIntent]       = useState("in_progress");
  const [premium, setPremium]     = useState<number | null>(null);
  const [errorMsg, setErrorMsg]   = useState("");

  const wsRef         = useRef<WebSocket | null>(null);
  const audioCtxRef   = useRef<AudioContext | null>(null);
  const playCtxRef    = useRef<AudioContext | null>(null);
  const processorRef  = useRef<ScriptProcessorNode | null>(null);
  const streamRef     = useRef<MediaStream | null>(null);
  const mutedRef      = useRef(false);
  const isAgentSpeakingRef      = useRef(false);
  const activePlaybacksRef      = useRef(0);
  const lastAgentPlaybackMsRef  = useRef(0);
  const bargeInFramesRef        = useRef(0);
  const bargeInSignaledRef      = useRef(false);
  const nextPlaybackTimeRef     = useRef(0);
  const playbackSourcesRef      = useRef<Set<AudioBufferSourceNode>>(new Set());
  const activeResponseTurnRef   = useRef<number | null>(null);
  const firstChunkSeenRef       = useRef<Record<number, boolean>>({});
  const firstPlaybackSeenRef    = useRef<Record<number, boolean>>({});
  const responseStartAtMsRef    = useRef(0);
  const lastBargeInAtMsRef      = useRef(0);
  const timerRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollRef   = useRef<ReturnType<typeof setInterval> | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  const stopAgentPlayback = useCallback(() => {
    for (const src of playbackSourcesRef.current) { try { src.stop(); } catch { /* */ } }
    playbackSourcesRef.current.clear();
    activePlaybacksRef.current  = 0;
    isAgentSpeakingRef.current  = false;
    lastAgentPlaybackMsRef.current = Date.now();
    nextPlaybackTimeRef.current = 0;
  }, []);

  const cleanupCall = useCallback(() => {
    wsRef.current?.close();
    stopAgentPlayback();
    processorRef.current?.disconnect();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    audioCtxRef.current?.close().catch(() => {});
    playCtxRef.current?.close().catch(() => {});
    if (timerRef.current) clearInterval(timerRef.current);
    if (pollRef.current) clearInterval(pollRef.current);
  }, [stopAgentPlayback]);

  const hangUp = useCallback(async () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "end" }));
    }
    cleanupCall();
    if (callId) {
      try {
        await fetch(`${BACKEND_HTTP}/session/end`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ call_id: callId, campaign_id: DEMO_CAMPAIGN_ID }),
        });
      } catch { /* ignore */ }
    }
    setStatus("ended");
  }, [callId, cleanupCall]);

  const startCall = useCallback(async () => {
    if (!DEMO_CUSTOMER_ID) {
      setErrorMsg("Demo customer ID not configured. Set NEXT_PUBLIC_DEMO_CUSTOMER_ID in .env.local");
      setStatus("error");
      return;
    }

    setStatus("connecting");
    setTranscript([]);
    setIntent("in_progress");
    setPremium(null);
    setElapsed(0);

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true, channelCount: 1 },
      });
    } catch {
      setErrorMsg("Microphone access denied. Please allow mic access and retry.");
      setStatus("error");
      return;
    }
    streamRef.current = stream;

    const ctx = new AudioContext();
    audioCtxRef.current = ctx;
    await ctx.resume().catch(() => {});
    const source    = ctx.createMediaStreamSource(stream);
    const processor = ctx.createScriptProcessor(1024, 1, 1);
    processorRef.current = processor;

    const playCtx = new AudioContext({ sampleRate: 48_000 });
    playCtxRef.current = playCtx;
    await playCtx.resume().catch(() => {});

    const wsEndpoint = `${BACKEND_WS}/ws/call?customer_id=${DEMO_CUSTOMER_ID}&campaign_id=${DEMO_CAMPAIGN_ID}`;
    const ws = new WebSocket(wsEndpoint);
    wsRef.current = ws;
    ws.binaryType = "arraybuffer";

    ws.onopen = () => {
      processor.onaudioprocess = (e) => {
        if (ws.readyState !== WebSocket.OPEN || mutedRef.current) return;
        const input = e.inputBuffer.getChannelData(0);
        const rms   = rmsEnergy(input);
        const now   = Date.now();
        const agentSpeaking = isAgentSpeakingRef.current
          || now - lastAgentPlaybackMsRef.current < AGENT_PLAYBACK_GRACE_MS;

        if (agentSpeaking) {
          const speakingMs = responseStartAtMsRef.current ? now - responseStartAtMsRef.current : 0;
          const cooldownOk = now - lastBargeInAtMsRef.current >= BARGE_IN_COOLDOWN_MS;
          if (speakingMs >= BARGE_IN_MIN_AGENT_MS && cooldownOk && rms >= BARGE_IN_RMS_THRESHOLD) {
            bargeInFramesRef.current += 1;
            if (bargeInFramesRef.current >= BARGE_IN_REQUIRED_FRAMES && !bargeInSignaledRef.current) {
              ws.send(JSON.stringify({ type: "barge_in", rms }));
              bargeInSignaledRef.current = true;
              lastBargeInAtMsRef.current = now;
              stopAgentPlayback();
            }
          } else {
            bargeInFramesRef.current = 0;
          }
        } else {
          bargeInFramesRef.current = 0;
          bargeInSignaledRef.current = false;
        }

        if (agentSpeaking && !bargeInSignaledRef.current) return;
        ws.send(encodeAndDecimate(input, ctx.sampleRate, TARGET_PCM_RATE));
      };
      source.connect(processor);
      const sink = ctx.createGain();
      sink.gain.value = 0;
      processor.connect(sink);
      sink.connect(ctx.destination);
    };

    ws.onmessage = async (event) => {
      if (typeof event.data === "string") {
        try {
          const msg = JSON.parse(event.data as string);
          if (msg.type === "call_started") {
            setCallId(msg.call_id);
            setStatus("active");
            timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
            pollRef.current = setInterval(async () => {
              try {
                const r = await fetch(`${BACKEND_HTTP}/calls/${msg.call_id}`);
                const d = await r.json();
                if (d.transcript) {
                  setTranscript(d.transcript.split("\n").filter((l: string) => l.trim()));
                }
                if (d.outcome && d.outcome !== "in_progress") setIntent(d.outcome);
                if (d.premium_quoted) setPremium(d.premium_quoted);
              } catch { /* ignore */ }
            }, 2000);
          } else if (msg.type === "error") {
            setErrorMsg(msg.data ?? "Call error");
            hangUp();
          } else if (msg.type === "response_start") {
            isAgentSpeakingRef.current = true;
            responseStartAtMsRef.current = Date.now();
            activeResponseTurnRef.current = Number(msg.turn_id ?? 0);
            const t = activeResponseTurnRef.current;
            firstChunkSeenRef.current[t] = false;
            firstPlaybackSeenRef.current[t] = false;
          } else if (msg.type === "barge_in_ack") {
            stopAgentPlayback();
          }
        } catch { /* ignore */ }
      } else {
        // Binary → agent audio
        try {
          const buf = await playCtx.decodeAudioData(event.data as ArrayBuffer);
          const src = playCtx.createBufferSource();
          src.buffer = buf;
          src.connect(playCtx.destination);
          activePlaybacksRef.current += 1;
          isAgentSpeakingRef.current = true;
          playbackSourcesRef.current.add(src);
          const now    = playCtx.currentTime;
          const startAt = Math.max(now, nextPlaybackTimeRef.current || now);
          nextPlaybackTimeRef.current = startAt + buf.duration;
          src.onended = () => {
            playbackSourcesRef.current.delete(src);
            activePlaybacksRef.current = Math.max(0, activePlaybacksRef.current - 1);
            if (activePlaybacksRef.current === 0) {
              isAgentSpeakingRef.current = false;
              lastAgentPlaybackMsRef.current = Date.now();
              nextPlaybackTimeRef.current = 0;
            }
          };
          src.start(startAt);
        } catch { /* ignore */ }
      }
    };

    ws.onclose = () => setStatus((s) => s === "active" ? "ended" : s);
    ws.onerror = () => { setErrorMsg("Connection to voice backend failed."); setStatus("error"); };
  }, [hangUp, stopAgentPlayback]);

  // Cleanup on unmount
  useEffect(() => () => { cleanupCall(); }, [cleanupCall]);

  const toggleMute = () => { mutedRef.current = !mutedRef.current; setMuted(mutedRef.current); };
  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent/15 to-primary/10 blur-3xl scale-110 pointer-events-none rounded-3xl" />

      <div className="relative bg-[hsl(220_43%_7%)] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">

        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Phone className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-semibold text-white text-sm">Anil Kumar</p>
              <p className="text-white/40 text-xs">Bike Insurance Renewal</p>
            </div>
          </div>
          <div className="text-right">
            {status === "active" && (
              <div className="flex items-center gap-1.5 justify-end mb-1">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">Live</span>
              </div>
            )}
            <div className="font-mono text-white/80 text-sm flex items-center gap-1">
              <Clock className="w-3 h-3 text-white/40" />
              {fmt(elapsed)}
            </div>
          </div>
        </div>

        {/* Intent strip */}
        {status === "active" && (
          <div className="flex items-center justify-between px-6 py-2 bg-white/5 border-b border-white/10 text-xs">
            <span className="text-white/40">Intent</span>
            <span className={`font-semibold ${INTENT_COLORS[intent] ?? "text-white/60"}`}>
              {INTENT_LABELS[intent] ?? intent.replace(/_/g, " ")}
            </span>
            {premium && (
              <span className="font-bold text-green-400">₹{premium.toLocaleString("en-IN")}</span>
            )}
          </div>
        )}

        {/* Transcript / idle body */}
        <div className="h-64 overflow-y-auto px-5 py-4">
          <AnimatePresence mode="wait">
            {status === "idle" && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-full gap-3 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/30 to-accent/20 border border-accent/20 flex items-center justify-center">
                  <Mic className="w-7 h-7 text-accent" />
                </div>
                <p className="text-white/70 text-sm">
                  Demo: Priya (AI) calls <strong className="text-white">Anil</strong> about his bike insurance renewal
                </p>
                <p className="text-white/30 text-xs">Conversation in Hindi · Real backend</p>
              </motion.div>
            )}

            {(status === "connecting") && (
              <motion.div
                key="connecting"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-full gap-3"
              >
                <Loader2 className="w-8 h-8 text-accent animate-spin" />
                <p className="text-white/60 text-sm">Connecting to voice backend…</p>
              </motion.div>
            )}

            {status === "active" && (
              <motion.div
                key="active"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="space-y-2"
              >
                {transcript.length === 0 ? (
                  <div className="flex items-center justify-center h-48 gap-2 text-white/40 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Waiting for conversation…
                  </div>
                ) : (
                  transcript.map((line, i) => {
                    const isAgent    = line.startsWith("Agent:");
                    const isCustomer = line.startsWith("Customer:");
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${isAgent ? "justify-start" : "justify-end"}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                            isAgent
                              ? "bg-white/10 text-white/80 rounded-tl-sm"
                              : isCustomer
                              ? "bg-gradient-to-r from-primary/40 to-accent/30 text-white rounded-tr-sm"
                              : "text-white/30 italic text-center w-full"
                          }`}
                        >
                          {isAgent || isCustomer ? line.replace(/^(Agent|Customer):\s*/, "") : line}
                        </div>
                      </motion.div>
                    );
                  })
                )}
                <div ref={transcriptEndRef} />
              </motion.div>
            )}

            {status === "ended" && (
              <motion.div
                key="ended"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center h-full gap-3 text-center"
              >
                <CheckCircle2 className="w-10 h-10 text-green-400" />
                <p className="text-white font-semibold">Call Ended</p>
                <p className={`text-sm font-medium ${INTENT_COLORS[intent] ?? "text-white/60"}`}>
                  Outcome: {INTENT_LABELS[intent] ?? intent}
                </p>
                {premium && (
                  <p className="text-green-400 font-bold">Quote: ₹{premium.toLocaleString("en-IN")}</p>
                )}
              </motion.div>
            )}

            {status === "error" && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-full gap-3 text-center px-4"
              >
                <XCircle className="w-8 h-8 text-red-400" />
                <p className="text-red-300 text-sm">{errorMsg}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Waveform (active only) */}
        {status === "active" && (
          <div className="flex justify-center items-end gap-0.5 h-8 px-6 pb-2">
            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={i}
                className="w-1 bg-gradient-to-t from-primary to-accent rounded-full"
                style={{
                  height: "4px",
                  animation: `waveform ${0.6 + (i % 5) * 0.15}s ease-in-out infinite`,
                  animationDelay: `${i * 0.04}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-center gap-5 px-6 py-5 border-t border-white/10">
          {status === "idle" || status === "ended" || status === "error" ? (
            <Button
              className="w-full h-12 rounded-2xl bg-gradient-to-r from-primary to-accent font-semibold hover:shadow-[0_0_30px_rgba(0,187,212,0.4)] transition-shadow"
              onClick={() => { setStatus("idle"); startCall(); }}
            >
              <Phone className="mr-2 w-4 h-4" />
              {status === "ended" || status === "error" ? "Call Again" : "Start Demo Call"}
            </Button>
          ) : (
            <>
              <button
                onClick={toggleMute}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                  muted ? "bg-white/20 text-white/60" : "bg-white/10 hover:bg-white/15 text-white"
                }`}
              >
                {muted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <button
                onClick={hangUp}
                className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center shadow-lg transition-colors"
              >
                <PhoneOff className="w-5 h-5 text-white" />
              </button>

              <button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/15 flex items-center justify-center transition-colors text-white">
                <Volume2 className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export default function VoiceDemo() {
  return (
    <section id="voice-demo" className="py-24 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(ellipse 60% 50% at 80% 50%, hsl(187 100% 42% / 0.07), transparent)",
        }}
      />

      <div className="container px-4 md:px-6 relative z-10">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium bg-accent/10 border border-accent/20 text-accent mb-4">
            Live Demo
          </span>
          <h2 className="font-headline text-3xl md:text-5xl font-bold mb-4">
            Watch the AI Agent{" "}
            <span className="gradient-text">Work for You</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Priya, our AI agent, calls customers about bike insurance renewal — in Hindi, naturally, at scale.
          </p>
        </motion.div>

        {/* Workflow steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-0 mb-16"
        >
          {WORKFLOW_STEPS.map((step, i) => (
            <div key={step.title} className="flex items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 + 0.3 }}
                className={`relative bg-gradient-to-br ${step.color} border ${step.border} rounded-2xl p-5 w-full md:w-56 text-center backdrop-blur-sm`}
              >
                <div className={`w-10 h-10 rounded-xl bg-white/10 border ${step.border} flex items-center justify-center mx-auto mb-3`}>
                  <step.icon className={`w-5 h-5 ${step.iconColor}`} />
                </div>
                <p className="font-semibold text-white text-sm mb-1">{step.title}</p>
                <p className="text-white/50 text-xs leading-relaxed">{step.desc}</p>

                {/* Step number */}
                <span className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-[10px] text-white/60 font-bold">
                  {i + 1}
                </span>
              </motion.div>

              {i < WORKFLOW_STEPS.length - 1 && (
                <div className="flex items-center justify-center px-3 md:px-2 rotate-90 md:rotate-0">
                  <ArrowRight className="w-5 h-5 text-white/20" />
                </div>
              )}
            </div>
          ))}
        </motion.div>

        {/* Demo call + results preview */}
        <div className="grid md:grid-cols-2 gap-12 items-start max-w-5xl mx-auto">

          {/* Left: Call UI */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="text-accent text-sm font-medium uppercase tracking-wider">Live Call</span>
              </div>
              <h3 className="font-headline text-2xl font-bold text-white mb-2">
                Campaign: Bike Insurance Renewal
              </h3>
              <p className="text-white/50 text-sm">
                Customer <strong className="text-white">Anil</strong> — Hero Splendor, policy expires soon.
                Priya calls in Hindi, collects interest &amp; feedback.
              </p>
            </div>
            <DemoCallUI />
          </motion.div>

          {/* Right: Results preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-sm font-medium uppercase tracking-wider">Dealer Dashboard</span>
              </div>
              <h3 className="font-headline text-2xl font-bold text-white mb-2">
                Structured Data Back to You
              </h3>
              <p className="text-white/50 text-sm">
                Every call result is logged, structured, and ready to action — no manual notes.
              </p>
            </div>

            {/* Sample result cards */}
            {[
              {
                name: "Anil Kumar",
                bike: "Hero Splendor 110cc",
                outcome: "INTERESTED",
                outcomeColor: "text-green-400 bg-green-400/10 border-green-400/20",
                comment: "Best price requested, callback at 5 PM",
                premium: "₹3,450",
              },
              {
                name: "Rajesh Singh",
                bike: "Bajaj Pulsar 150cc",
                outcome: "ALREADY_RENEWED",
                outcomeColor: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
                comment: "Renewed with HDFC Ergo. Price competitive.",
                premium: null,
              },
              {
                name: "Pradeep Nair",
                bike: "Royal Enfield 350cc",
                outcome: "CALL_LATER",
                outcomeColor: "text-blue-400 bg-blue-400/10 border-blue-400/20",
                comment: "Travelling, call back tomorrow 11 AM",
                premium: null,
              },
            ].map((row, i) => (
              <motion.div
                key={row.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 + 0.4 }}
                className="glass-card p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-white text-sm">{row.name}</p>
                    <p className="text-white/40 text-xs">{row.bike}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {row.premium && (
                      <span className="text-green-400 font-bold text-sm">{row.premium}</span>
                    )}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${row.outcomeColor} uppercase tracking-wider`}>
                      {row.outcome.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>
                <p className="text-white/50 text-xs">{row.comment}</p>
              </motion.div>
            ))}

            <div className="flex items-center gap-2 pt-2 text-white/30 text-xs">
              <Sparkles className="w-3 h-3" />
              All data auto-structured from AI conversation · Export to Excel
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
