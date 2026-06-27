import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  signInWithPopup,
  signOut as fbSignOut,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { usePassportStore } from "@/lib/store/usePassportStore";

export interface AuthUser {
  uid: string;
  displayName: string;
  photoURL: string;
  email: string;
}

interface AuthState {
  user: AuthUser | null;
  customAvatarUrl: string | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  updateAvatar: (url: string) => void;
  init: () => () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      customAvatarUrl: null,

      signIn: async () => {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const u = result.user;
        set({
          user: {
            uid: u.uid,
            displayName: u.displayName ?? "Người dùng",
            photoURL: u.photoURL ?? "",
            email: u.email ?? "",
          },
        });
      },

      signOut: async () => {
        await fbSignOut(auth);
        set({ user: null, customAvatarUrl: null });
        usePassportStore.getState().clearForLogout();
      },

      updateAvatar: (url) => set({ customAvatarUrl: url }),

      init: () => {
        const unsub = onAuthStateChanged(auth, (u) => {
          if (u) {
            set((s) => ({
              user: {
                uid: u.uid,
                displayName: u.displayName ?? s.user?.displayName ?? "Người dùng",
                photoURL: u.photoURL ?? s.user?.photoURL ?? "",
                email: u.email ?? "",
              },
            }));
            // Sync travel history from server after login
            usePassportStore.getState().syncFromServer();
          } else {
            set({ user: null });
          }
        });
        return unsub;
      },
    }),
    {
      name: "via.auth",
      partialize: (s) => ({ user: s.user, customAvatarUrl: s.customAvatarUrl }),
    },
  ),
);
