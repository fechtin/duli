import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// The two rules this directory lives by are both invisible to every other check in the repo.
//
// 1. `@/` does not resolve at runtime in the Worker. wrangler/esbuild will not expand the alias
//    for subpaths, `wrangler.toml` aliases only the bare "@", and `npm run typecheck` cannot catch
//    it because `tsconfig.worker.json` is not in the project-refs graph AND declares `@/*` itself.
//    So a violation typechecks, builds, passes `wrangler dev`, and 500s in production.
// 2. The engine must be a pure function of its inputs — the plan is identified in the URL by its
//    parameters, cached at the edge, and asserted exactly in tests. One `Math.random()` or one
//    `Date.now()` breaks all three at once, silently.
//
// Nothing else in the toolchain notices either. This file is the guard.

const DIR = join(import.meta.dirname, ".");

function engineSources(): { name: string; code: string }[] {
  return readdirSync(DIR)
    .filter((f) => f.endsWith(".ts") && !f.endsWith(".test.ts"))
    .map((name) => ({ name, code: readFileSync(join(DIR, name), "utf8") }));
}

describe("engine module hygiene", () => {
  it("has sources to check", () => {
    expect(engineSources().length).toBeGreaterThan(8);
  });

  it("never imports through the @/ alias at runtime", () => {
    for (const { name, code } of engineSources()) {
      // `import type … from "@/…"` is erased by verbatimModuleSyntax and is safe; a value import
      // is not. Match only the value form.
      const offenders = [...code.matchAll(/^\s*import\s+(?!type\b)[^;]*?from\s+"(@\/[^"]+)"/gm)];
      expect(offenders.map((m) => `${name}: ${m[1]}`)).toEqual([]);
    }
  });

  it("uses explicit .ts extensions on relative imports", () => {
    // Required by the Node type-stripping scripts that import this engine directly, and harmless
    // everywhere else. Same convention as src/data and src/lib/i18n/dictionaries.
    for (const { name, code } of engineSources()) {
      const bad = [...code.matchAll(/from\s+"(\.[^"]*?)"/g)]
        .map((m) => m[1])
        .filter((spec) => !spec.endsWith(".ts") && !spec.endsWith(".json"));
      expect(bad.map((s) => `${name}: ${s}`)).toEqual([]);
    }
  });

  it("contains no source of non-determinism", () => {
    for (const { name, code } of engineSources()) {
      const stripped = code.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
      expect(`${name}:${/Math\.random\s*\(/.test(stripped)}`).toBe(`${name}:false`);
      expect(`${name}:${/Date\.now\s*\(|new Date\s*\(/.test(stripped)}`).toBe(`${name}:false`);
    }
  });
});
