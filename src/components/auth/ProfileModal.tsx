import { useRef, useState } from "react";
import { X, Camera, LogOut, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { uploadAvatarPhoto } from "@/lib/share/uploadPhoto";
import { Button } from "@/components/ui/Button";
import { panelTransition } from "@/design/motion";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function ProfileModal({ open, onClose }: Props) {
  const user = useAuthStore((s) => s.user);
  const customAvatarUrl = useAuthStore((s) => s.customAvatarUrl);
  const updateAvatar = useAuthStore((s) => s.updateAvatar);
  const signOut = useAuthStore((s) => s.signOut);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  if (!user) return null;

  const avatarUrl = preview || customAvatarUrl || user.photoURL;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);
    setUploading(true);
    try {
      const url = await uploadAvatarPhoto(file);
      updateAvatar(url);
      setPreview(null);
    } catch {
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="absolute inset-0 z-[70] flex items-end justify-center md:items-center">
          <motion.div
            className="absolute inset-0 bg-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%", opacity: 0.6 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={panelTransition}
            className="relative z-10 w-full max-w-xs rounded-t-[var(--radius-sheet)] border border-border bg-surface p-6 shadow-[var(--shadow-e3)] md:rounded-[var(--radius-panel)]"
          >
            <button onClick={onClose} className="absolute right-4 top-4 text-muted hover:text-foreground">
              <X size={18} />
            </button>

            <h2 className="mb-5 text-sm font-semibold text-foreground">Hồ sơ của bạn</h2>

            {/* Avatar */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={user.displayName} className="h-20 w-20 rounded-full object-cover ring-2 ring-primary/30" />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                    {user.displayName[0].toUpperCase()}
                  </div>
                )}
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-surface bg-primary text-primary-foreground shadow-sm disabled:opacity-60"
                >
                  {uploading ? <Loader2 size={13} className="animate-spin" /> : <Camera size={13} />}
                </button>
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              <div className="text-center">
                <p className="font-semibold text-foreground">{user.displayName}</p>
                <p className="text-xs text-muted">{user.email}</p>
              </div>
            </div>

            <Button variant="secondary" className="mt-6 w-full" onClick={handleSignOut}>
              <LogOut size={15} />
              Đăng xuất
            </Button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
