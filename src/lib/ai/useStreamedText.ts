import { useEffect, useState } from "react";

/** Consume an async-generator of tokens into growing text (Bible 010 §13 streaming). */
export function useStreamedText(start: (() => AsyncGenerator<string>) | null, deps: unknown[]) {
  const [text, setText] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!start) return;
    let alive = true;
    setText("");
    setDone(false);
    (async () => {
      try {
        for await (const tk of start()) {
          if (!alive) return;
          setText((p) => p + tk);
        }
      } finally {
        if (alive) setDone(true);
      }
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { text, done };
}
