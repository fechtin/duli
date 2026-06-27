import { useState } from "react";
import { LogIn } from "lucide-react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { ProfileModal } from "./ProfileModal";

export function LoginButton() {
  const user = useAuthStore((s) => s.user);
  const customAvatarUrl = useAuthStore((s) => s.customAvatarUrl);
  const signIn = useAuthStore((s) => s.signIn);
  const [profileOpen, setProfileOpen] = useState(false);
  const [signingIn, setSigningIn] = useState(false);

  const handleSignIn = async () => {
    setSigningIn(true);
    try {
      await signIn();
    } finally {
      setSigningIn(false);
    }
  };

  const avatarUrl = customAvatarUrl || user?.photoURL;

  if (!user) {
    return (
      <button
        onClick={handleSignIn}
        disabled={signingIn}
        aria-label="Đăng nhập"
        className="grid h-10 w-10 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-foreground disabled:opacity-50"
      >
        <LogIn size={18} />
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => setProfileOpen(true)}
        aria-label="Hồ sơ của bạn"
        className="grid h-10 w-10 place-items-center rounded-full transition-colors hover:ring-2 hover:ring-primary/50"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={user.displayName}
            className="h-7 w-7 rounded-full object-cover ring-1 ring-primary/40"
          />
        ) : (
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
            {user.displayName[0].toUpperCase()}
          </span>
        )}
      </button>
      <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
    </>
  );
}
