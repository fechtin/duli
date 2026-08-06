import { Fragment, type ReactNode } from "react";

/**
 * The little bit of Markdown a chat answer actually contains — bold, italics, line breaks.
 *
 * Models emit it whether or not the prompt asks them to: a real production answer arrived as
 * "khoảng **399.000 đồng** … *(Số liệu này lấy từ web…)*" and rendered with the asterisks
 * showing, which reads like a bug. Rendering the few marks that appear is cheaper and more
 * robust than a Markdown dependency or a prompt rule the smaller lanes ignore.
 *
 * Output is React nodes, never `dangerouslySetInnerHTML` — model output is untrusted text and
 * must never reach the DOM as markup.
 */

// `**bold**` first so the single-asterisk branch cannot bite into it. Underscores need word
// boundaries either side, or `file_name_here` renders as "file<em>name</em>here".
const INLINE =
  /\*\*([^*]+)\*\*|\*([^*\n]+)\*|(?<!\w)__([^_]+)__(?!\w)|(?<!\w)_([^_\n]+)_(?!\w)|`([^`\n]+)`/g;

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  INLINE.lastIndex = 0;

  while ((m = INLINE.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const key = `${keyPrefix}-${m.index}`;
    const [, bold, italic, boldAlt, italicAlt, code] = m;
    if (bold ?? boldAlt) out.push(<strong key={key} className="font-semibold">{bold ?? boldAlt}</strong>);
    else if (italic ?? italicAlt) out.push(<em key={key}>{italic ?? italicAlt}</em>);
    else if (code) out.push(<code key={key} className="rounded bg-foreground/10 px-1 py-0.5 text-[0.9em]">{code}</code>);
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function RichText({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, i) => {
        // A leading "- " or "* " is a bullet the model wrote; show it as one instead of a stray dash.
        const bullet = /^\s*[-*]\s+/.exec(line);
        const body = bullet ? line.slice(bullet[0].length) : line;
        return (
          <Fragment key={i}>
            {i > 0 && <br />}
            {bullet && <span className="mr-1 opacity-60">•</span>}
            {renderInline(body, String(i))}
          </Fragment>
        );
      })}
    </>
  );
}
