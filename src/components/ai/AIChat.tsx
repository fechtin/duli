import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Sparkles, Send, X } from "lucide-react";
import { ai, type AIContext, type AIMessage } from "@/lib/ai";
import { useUIStore } from "@/lib/store/useUIStore";
import { useMapStore } from "@/lib/store/useMapStore";
import { useContentStore } from "@/lib/store/useContentStore";
import { fetchDestination, fetchProvinceBundle, getProvinceMeta } from "@/lib/api/content";
import { useAsync } from "@/lib/utils/useAsync";
import { useI18n, useT } from "@/lib/i18n";
import { Chip } from "@/components/ui/Chip";
import { panelTransition } from "@/design/motion";
import { cn } from "@/lib/utils/cn";

export function AIChat() {
  const t = useT();
  const { locale } = useI18n();
  const open = useUIStore((s) => s.aiOpen);
  const setOpen = useUIStore((s) => s.setAiOpen);
  const selectedProvince = useMapStore((s) => s.selectedProvince);
  const selectedDestination = useMapStore((s) => s.selectedDestination);

  const lightDest = useContentStore((s) => s.destinations).find((d) => d.id === selectedDestination);
  const provinceSlug = selectedProvince ?? lightDest?.provinceSlug;
  const provinceName = provinceSlug ? getProvinceMeta(provinceSlug)?.name : undefined;

  // Fetch grounding content for the current selection (Bible 010 §4 context-aware).
  const { data: dest } = useAsync(
    () => (selectedDestination ? fetchDestination(selectedDestination, locale) : Promise.resolve(null)),
    [selectedDestination, locale],
  );
  const { data: bundle } = useAsync(
    () => (provinceSlug ? fetchProvinceBundle(provinceSlug, locale) : Promise.resolve(null)),
    [provinceSlug, locale],
  );

  const context = useMemo<AIContext>(
    () => ({
      locale,
      destinationId: selectedDestination ?? undefined,
      provinceSlug,
      destination: dest ?? undefined,
      provinceBundle: bundle ?? undefined,
    }),
    [locale, selectedDestination, provinceSlug, dest, bundle],
  );

  const contextLabel = lightDest?.name ?? provinceName ?? t("ai.contextVietnam");

  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const suggestions = useMemo(() => ai.suggestions(context), [context]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, streaming]);

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || streaming) return;
    const next = [...messages, { role: "user" as const, content }];
    setMessages(next);
    setInput("");
    setStreaming(true);
    setMessages((m) => [...m, { role: "assistant", content: "" }]);
    for await (const tk of ai.streamChat(next, context)) {
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = { role: "assistant", content: copy[copy.length - 1].content + tk };
        return copy;
      });
    }
    setStreaming(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="absolute inset-0 z-30 bg-overlay md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={panelTransition}
            className="absolute inset-x-0 bottom-0 z-40 flex h-[70%] flex-col rounded-t-[var(--radius-sheet)] border border-border bg-surface shadow-[var(--shadow-e3)] md:inset-x-auto md:bottom-5 md:right-5 md:h-[560px] md:w-[380px] md:rounded-[var(--radius-panel)]"
          >
            {/* Header */}
            <div className="flex items-center gap-2.5 border-b border-border px-4 py-3">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-primary-soft text-primary">
                <Sparkles size={16} />
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{t("ai.title")}</p>
                <p className="text-xs text-muted">{contextLabel}</p>
              </div>
              <button onClick={() => setOpen(false)} aria-label={t("panel.close")} className="text-muted hover:text-foreground">
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="no-scrollbar flex-1 space-y-3 overflow-y-auto p-4">
              {messages.length === 0 && (
                <div className="rounded-[var(--radius-md)] bg-surface-2 p-3 text-sm text-foreground/85">{t("ai.greeting")}</div>
              )}
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={cn(
                    "max-w-[85%] rounded-[var(--radius-md)] px-3 py-2 text-sm leading-relaxed",
                    m.role === "user"
                      ? "ml-auto bg-primary text-primary-foreground"
                      : "bg-surface-2 text-foreground/90",
                  )}
                >
                  {m.content}
                  {m.role === "assistant" && streaming && i === messages.length - 1 && (
                    <span className="ml-0.5 inline-block h-3.5 w-0.5 animate-pulse bg-primary align-middle" />
                  )}
                </div>
              ))}
            </div>

            {/* Suggestions */}
            {!streaming && (
              <div className="no-scrollbar flex gap-1.5 overflow-x-auto px-4 pb-2">
                {suggestions.map((s) => (
                  <Chip key={s.label} onClick={() => send(s.prompt)}>
                    {s.label}
                  </Chip>
                ))}
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2 border-t border-border p-3 pb-safe"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("ai.placeholder", { context: contextLabel })}
                className="h-10 flex-1 rounded-full border border-border bg-surface-2 px-4 text-sm outline-none focus:border-primary"
              />
              <button
                type="submit"
                disabled={!input.trim() || streaming}
                aria-label={t("ai.send")}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition active:scale-95 disabled:opacity-40"
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
