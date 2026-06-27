import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, Sparkles, Check, ArrowLeft, Share2, Camera, Loader2 } from "lucide-react";
import { ai } from "@/lib/ai";
import { useUIStore } from "@/lib/store/useUIStore";
import { useContentStore } from "@/lib/store/useContentStore";
import { usePassportStore } from "@/lib/store/usePassportStore";
import { useI18n, useT } from "@/lib/i18n";
import { IllustratedImage } from "@/components/ui/IllustratedImage";
import { Button } from "@/components/ui/Button";
import { panelTransition, springSoft } from "@/design/motion";
import { cn } from "@/lib/utils/cn";
import { uploadCheckinPhoto } from "@/lib/share/uploadPhoto";

const steps = ["checkin.step.photo", "checkin.step.caption", "checkin.step.share"] as const;

export function CheckinFlow() {
  const t = useT();
  const { locale } = useI18n();
  const targetId = useUIStore((s) => s.checkinTarget);
  const close = useUIStore((s) => s.closeCheckin);
  const setPassportOpen = useUIStore((s) => s.setPassportOpen);
  const addCheckin = usePassportStore((s) => s.addCheckin);

  const destinations = useContentStore((s) => s.destinations);
  const dest = targetId ? destinations.find((d) => d.id === targetId) : undefined;
  const [step, setStep] = useState(0);
  const [photo, setPhoto] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState("");
  const [aiBusy, setAiBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const open = Boolean(dest);

  // Reset when a new target opens.
  useEffect(() => {
    if (!targetId) return;
    setStep(0);
    setPhoto(destinations.find((d) => d.id === targetId)?.gallery[0]?.seed ?? null);
    setUploadedUrl(null);
    setUploadedPreview(null);
    setCaption("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetId]);

  if (!dest) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Immediate local preview
    const preview = URL.createObjectURL(file);
    setUploadedPreview(preview);
    setUploadedUrl(null);
    setPhoto(null); // clear gallery selection

    // Upload in background
    setUploading(true);
    try {
      const url = await uploadCheckinPhoto(file, dest.id);
      setUploadedUrl(url);
    } catch {
      // Upload failed — keep local preview, photoUrl will be null on save
    } finally {
      setUploading(false);
    }
  };

  const writeWithAI = async () => {
    setAiBusy(true);
    const c = await ai.caption({ locale, destinationId: dest.id, destinationName: dest.name, provinceSlug: dest.provinceSlug });
    setCaption(c);
    setAiBusy(false);
  };

  const finish = () => {
    addCheckin({
      destinationId: dest.id,
      destinationName: dest.name,
      provinceSlug: dest.provinceSlug,
      caption: caption.trim() || dest.name,
      photoSeed: photo ?? dest.id,
      photoUrl: uploadedUrl ?? undefined,
    });
    setStep(2);
  };

  const selectedSeed = photo;
  const hasPhoto = Boolean(selectedSeed || uploadedPreview);

  return (
    <AnimatePresence>
      {open && (
        <div className="absolute inset-0 z-[60] flex items-end justify-center md:items-center">
          <motion.div
            className="absolute inset-0 bg-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.div
            initial={{ y: "100%", opacity: 0.6 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={panelTransition}
            className="relative z-10 flex w-full max-w-md flex-col rounded-t-[var(--radius-sheet)] border border-border bg-surface shadow-[var(--shadow-e3)] md:rounded-[var(--radius-panel)]"
          >
            {/* Header + steps */}
            <div className="flex items-center gap-3 border-b border-border px-5 py-3.5">
              {step === 1 && (
                <button onClick={() => setStep(0)} className="text-muted hover:text-foreground" aria-label={t("checkin.back")}>
                  <ArrowLeft size={18} />
                </button>
              )}
              <p className="flex-1 text-sm font-semibold text-foreground">{t("checkin.title", { name: dest.name })}</p>
              <button onClick={close} aria-label={t("panel.close")} className="text-muted hover:text-foreground">
                <X size={18} />
              </button>
            </div>

            <div className="flex gap-1.5 px-5 pt-3">
              {steps.map((_, i) => (
                <span key={i} className={cn("h-1 flex-1 rounded-full transition-colors", i <= step ? "bg-primary" : "bg-border")} />
              ))}
            </div>

            <div className="p-5">
              {step === 0 && (
                <div>
                  <p className="mb-3 text-sm text-muted">{t("checkin.addPhoto")}</p>

                  {/* Upload from device */}
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <button
                    onClick={() => fileRef.current?.click()}
                    className={cn(
                      "mb-3 flex w-full items-center gap-2.5 rounded-[var(--radius-md)] border-2 border-dashed px-4 py-3 text-sm transition",
                      uploadedPreview
                        ? "border-primary/60 bg-primary/5 text-primary"
                        : "border-border text-muted hover:border-primary/50 hover:text-foreground",
                    )}
                  >
                    {uploading ? (
                      <Loader2 size={16} className="animate-spin shrink-0" />
                    ) : (
                      <Camera size={16} className="shrink-0" />
                    )}
                    <span className="truncate">
                      {uploading
                        ? "Đang tải ảnh lên..."
                        : uploadedPreview
                          ? "Ảnh của bạn đã chọn ✓"
                          : "Tải ảnh từ thiết bị"}
                    </span>
                    {uploadedPreview && (
                      <img src={uploadedPreview} className="ml-auto h-10 w-10 shrink-0 rounded object-cover" />
                    )}
                  </button>

                  {/* Gallery fallback */}
                  {!uploadedPreview && (
                    <div className="grid grid-cols-3 gap-2">
                      {dest.gallery.map((g) => (
                        <button
                          key={g.seed}
                          onClick={() => setPhoto(g.seed)}
                          className={cn(
                            "overflow-hidden rounded-[var(--radius-md)] ring-2 transition",
                            photo === g.seed ? "ring-primary" : "ring-transparent hover:ring-border-strong",
                          )}
                        >
                          <IllustratedImage seed={g.seed} ratio="1/1" rounded={false} />
                        </button>
                      ))}
                    </div>
                  )}

                  <Button className="mt-5 w-full" onClick={() => setStep(1)} disabled={!hasPhoto}>
                    {t("checkin.next")}
                  </Button>
                </div>
              )}

              {step === 1 && (
                <div>
                  {uploadedPreview ? (
                    <div className="mb-3 overflow-hidden rounded-[var(--radius-md)] aspect-video w-full bg-surface-2">
                      <img src={uploadedPreview} className="h-full w-full object-cover" />
                    </div>
                  ) : (
                    selectedSeed && <IllustratedImage seed={selectedSeed} ratio="16/9" className="mb-3" />
                  )}
                  <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder={t("checkin.captionPlaceholder")}
                    rows={3}
                    className="w-full resize-none rounded-[var(--radius-md)] border border-border bg-surface-2 p-3 text-sm outline-none focus:border-primary"
                  />
                  <button
                    onClick={writeWithAI}
                    disabled={aiBusy}
                    className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1.5 text-xs font-medium text-primary disabled:opacity-60"
                  >
                    <Sparkles size={13} />
                    {aiBusy ? t("ai.thinking") : t("checkin.aiCaption")}
                  </button>
                  <Button className="mt-5 w-full" onClick={finish} disabled={uploading}>
                    {uploading ? "Đang tải ảnh..." : t("checkin.done")}
                  </Button>
                </div>
              )}

              {step === 2 && (
                <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={springSoft} className="text-center">
                  <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-success/15 text-success">
                    <Check size={28} />
                  </div>
                  <p className="mb-1 font-display text-lg font-semibold text-foreground">{t("checkin.success")}</p>
                  {uploadedPreview ? (
                    <div className="mt-4 overflow-hidden rounded-[var(--radius-md)] aspect-video w-full bg-surface-2">
                      <img src={uploadedPreview} className="h-full w-full object-cover" />
                    </div>
                  ) : (
                    selectedSeed && <IllustratedImage seed={selectedSeed} ratio="16/9" caption={caption || dest.name} className="mt-4" />
                  )}
                  <div className="mt-5 flex gap-2">
                    <Button
                      variant="secondary"
                      className="flex-1"
                      onClick={() => {
                        close();
                        setPassportOpen(true);
                      }}
                    >
                      <Share2 size={16} />
                      {t("passport.title")}
                    </Button>
                    <Button className="flex-1" onClick={close}>
                      {t("panel.close")}
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
