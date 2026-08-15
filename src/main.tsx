import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { I18nProvider } from "@/lib/i18n";
import { lockViewportHeight } from "@/lib/ui/viewportLock";
import "./index.css";

// Before first paint: the shell is sized from --app-h, which starts as a value iOS may lie about.
lockViewportHeight();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </StrictMode>,
);

// Offline support — register only in production to avoid caching the dev server (Bible 012 §17).
if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}
