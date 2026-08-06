import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { RichText } from "./RichText";

// Rendered to a string rather than a DOM: react-dom is already a dependency, so this needs no
// jsdom. What matters is that no raw Markdown mark survives to the screen.
const html = (text: string) => renderToStaticMarkup(<RichText text={text} />);

describe("RichText", () => {
  it("renders bold instead of showing asterisks", () => {
    // Verbatim from a production answer that shipped with the asterisks visible.
    const out = html("khoảng **399.000 đồng** (theo sanvemaybay.vn)");
    expect(out).toContain("<strong");
    expect(out).toContain("399.000 đồng");
    expect(out).not.toContain("**");
  });

  it("renders the source caveat as italics", () => {
    const out = html("*(Số liệu này lấy từ web, không phải dữ liệu xác thực của atlas.)*");
    expect(out).toContain("<em>");
    expect(out).not.toContain("*");
  });

  it("keeps line breaks and turns leading dashes into bullets", () => {
    const out = html("Gợi ý:\n- Ruộng bậc thang\n- Đèo Khau Phạ");
    expect(out.match(/<br\/?>/g)).toHaveLength(2);
    expect(out).toContain("•");
    expect(out).not.toMatch(/>\s*-\s/);
  });

  it("leaves ordinary prose untouched", () => {
    const plain = "Nên đến vào tháng 9 để xem lúa chín.";
    expect(html(plain)).toBe(plain);
  });

  it("does not treat a lone asterisk or underscore as formatting", () => {
    expect(html("2 * 3 = 6")).toContain("2 * 3 = 6");
    expect(html("file_name_here")).toContain("file_name_here");
  });

  // Model output is untrusted: it must never reach the DOM as markup.
  it("escapes HTML in model output", () => {
    const out = html('<img src=x onerror="alert(1)">');
    expect(out).not.toContain("<img");
    expect(out).toContain("&lt;img");
  });
});
