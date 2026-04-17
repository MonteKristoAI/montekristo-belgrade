import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send, X, Sparkles, User as UserIcon, Copy, RotateCcw } from "lucide-react";
import { mkSupabase, type MkClient } from "@/lib/mk-onboarding/supabase";
import { buildClientContextMarkdown, edgeFnUrl, EDGE_FN_ANON } from "@/lib/mk-onboarding/buildClientContext";
import { theme } from "../theme";
import { toast } from "sonner";

type Msg = { role: "user" | "assistant"; content: string };

export function AIChatPanel({
  client,
  open,
  onClose,
}: {
  client: MkClient;
  open: boolean;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [context, setContext] = useState<string>("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load saved chat from localStorage per-client
  useEffect(() => {
    const saved = localStorage.getItem(`mk-chat-${client.id}`);
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch {
        setMessages([]);
      }
    } else {
      setMessages([]);
    }
  }, [client.id]);

  // Persist
  useEffect(() => {
    localStorage.setItem(`mk-chat-${client.id}`, JSON.stringify(messages));
  }, [messages, client.id]);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, streaming]);

  // Build context once per open + client
  useEffect(() => {
    if (!open) return;
    buildClientContextMarkdown(client).then(setContext);
  }, [open, client.id]);

  const send = async () => {
    const trimmed = input.trim();
    if (!trimmed || streaming) return;
    const newMessages = [...messages, { role: "user" as const, content: trimmed }];
    setMessages(newMessages);
    setInput("");
    setStreaming(true);

    // Add placeholder assistant message we'll stream into
    setMessages((m) => [...m, { role: "assistant", content: "" }]);

    try {
      const { data: sess } = await mkSupabase.auth.getSession();
      const bearer = sess.session?.access_token ?? EDGE_FN_ANON;

      const res = await fetch(edgeFnUrl("mk-ai-chat"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bearer}`,
          apikey: EDGE_FN_ANON,
        },
        body: JSON.stringify({
          clientContext: context,
          messages: newMessages,
        }),
      });

      if (!res.ok || !res.body) {
        const text = await res.text().catch(() => "");
        throw new Error(`Edge fn error ${res.status}: ${text}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6).trim();
          if (payload === "[DONE]" || !payload) continue;
          try {
            const evt = JSON.parse(payload);
            if (evt.text) {
              setMessages((m) => {
                const copy = [...m];
                copy[copy.length - 1] = {
                  role: "assistant",
                  content: copy[copy.length - 1].content + evt.text,
                };
                return copy;
              });
            }
            if (evt.error) throw new Error(JSON.stringify(evt.error));
          } catch {
            /* skip */
          }
        }
      }
    } catch (e) {
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = {
          role: "assistant",
          content: "**Greska pri pozivu AI-ja.** Proveri da je edge funkcija `mk-ai-chat` deploy-ovana i da ima `ANTHROPIC_API_KEY` env. Detalji u konzoli.",
        };
        return copy;
      });
      console.error(e);
    } finally {
      setStreaming(false);
    }
  };

  const reset = () => {
    if (!confirm("Obrisati chat istoriju?")) return;
    setMessages([]);
    localStorage.removeItem(`mk-chat-${client.id}`);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: theme.motion.base, ease: theme.motion.ease }}
            className="fixed right-0 top-0 bottom-0 w-[480px] max-w-[100vw] bg-[#060B18] border-l border-white/10 z-50 flex flex-col shadow-[0_0_40px_rgba(0,0,0,0.6)]"
          >
            <header className="px-5 py-4 border-b border-white/10 flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-gradient-to-br from-[#FF5C5C] to-[#8B3838] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-poppins text-sm font-semibold text-[#F5F0E6] tracking-tight truncate">
                  AI co-pilot
                </p>
                <p className="font-inter text-[11px] text-[#9AA5B8] truncate">
                  Scoped za {client.name}
                </p>
              </div>
              <button
                onClick={reset}
                className="p-1.5 rounded-md text-[#9AA5B8] hover:text-[#F5F0E6] hover:bg-white/5"
                title="Novi chat"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-md text-[#9AA5B8] hover:text-[#F5F0E6] hover:bg-white/5"
              >
                <X className="w-4 h-4" />
              </button>
            </header>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {messages.length === 0 && (
                <div className="space-y-3">
                  <p className="font-inter text-xs text-[#9AA5B8] leading-relaxed">
                    Pitaj bilo sta o ovom klijentu. Moj kontekst je pun profil — brand voice, integracije, deliverables, otvorena pitanja, recent performance.
                  </p>
                  <p className="font-inter text-[10px] uppercase tracking-wider text-[#5A6577] pt-2">Primeri</p>
                  {[
                    "Kako bi ti unapredio njihov marketing u naredne 2 nedelje?",
                    "Koje 3 blog teme bi najjace radile za njihov ICP?",
                    "Draftuj odgovor na zadnji blocker — profesionalno i direktno.",
                    "Sta bi promenio na njihovom sajtu da im skoci CTR?",
                  ].map((q) => (
                    <button
                      key={q}
                      onClick={() => setInput(q)}
                      className="w-full text-left px-3 py-2 rounded-md bg-white/5 hover:bg-white/10 font-inter text-xs text-[#F5F0E6] transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
              {messages.map((m, i) => (
                <MessageBubble key={i} message={m} />
              ))}
              {streaming && messages[messages.length - 1]?.content === "" && (
                <div className="flex items-center gap-1.5 px-4 py-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF5C5C] animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF5C5C] animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF5C5C] animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="border-t border-white/10 p-4"
            >
              <div className="flex items-end gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                  placeholder="Pitaj…  (Enter za slanje, Shift+Enter za novi red)"
                  rows={2}
                  className="flex-1 resize-none rounded-md bg-[#0A1228] border border-white/10 px-3 py-2 font-inter text-sm text-[#F5F0E6] placeholder:text-[#5A6577] focus:outline-none focus:border-[rgba(255,92,92,0.4)]"
                />
                <button
                  type="submit"
                  disabled={streaming || !input.trim()}
                  className="h-10 w-10 rounded-md bg-[#FF5C5C] text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#FF7A7A] transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="font-inter text-[10px] text-[#5A6577] mt-2">
                Model: Claude Sonnet 4.6 · Context se sejva lokalno per-klijent.
              </p>
            </form>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function MessageBubble({ message }: { message: Msg }) {
  const isUser = message.role === "user";
  const copy = async () => {
    await navigator.clipboard.writeText(message.content);
    toast.success("Kopirano");
  };
  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${
          isUser ? "bg-white/10" : "bg-gradient-to-br from-[#FF5C5C] to-[#8B3838]"
        }`}
      >
        {isUser ? <UserIcon className="w-3.5 h-3.5 text-[#9AA5B8]" /> : <Sparkles className="w-3.5 h-3.5 text-white" />}
      </div>
      <div className={`flex-1 min-w-0 ${isUser ? "text-right" : ""}`}>
        <div
          className={`inline-block max-w-full rounded-xl px-3 py-2 font-inter text-sm leading-relaxed whitespace-pre-wrap break-words ${
            isUser
              ? "bg-[rgba(255,92,92,0.12)] text-[#F5F0E6] border border-[rgba(255,92,92,0.25)]"
              : "bg-white/5 text-[#F5F0E6] border border-white/10"
          }`}
        >
          {message.content || "…"}
        </div>
        {!isUser && message.content && (
          <button
            onClick={copy}
            className="mt-1 inline-flex items-center gap-1 font-inter text-[10px] text-[#5A6577] hover:text-[#F5F0E6] transition-colors"
          >
            <Copy className="w-2.5 h-2.5" /> kopiraj
          </button>
        )}
      </div>
    </div>
  );
}
