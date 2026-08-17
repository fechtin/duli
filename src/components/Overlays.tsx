import { SearchOverlay } from "@/components/search/SearchOverlay";
import { AIChat } from "@/components/ai/AIChat";
import { PassportPanel } from "@/components/passport/PassportPanel";
import { CheckinFlow } from "@/components/checkin/CheckinFlow";
import { SettingsSheet } from "@/components/shell/SettingsSheet";
import { Lightbox } from "@/components/ui/Lightbox";

/** Secondary surfaces, code-split out of the first paint (Bible 012 §10). */
export default function Overlays() {
  return (
    <>
      <SearchOverlay />
      <AIChat />
      <PassportPanel />
      <CheckinFlow />
      <SettingsSheet />
      <Lightbox />
    </>
  );
}
