import { SearchOverlay } from "@/components/search/SearchOverlay";
import { AIChat } from "@/components/ai/AIChat";
import { PassportPanel } from "@/components/passport/PassportPanel";
import { CheckinFlow } from "@/components/checkin/CheckinFlow";

/** Secondary surfaces, code-split out of the first paint (Bible 012 §10). */
export default function Overlays() {
  return (
    <>
      <SearchOverlay />
      <AIChat />
      <PassportPanel />
      <CheckinFlow />
    </>
  );
}
