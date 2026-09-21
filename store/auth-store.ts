"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { DemoUser, Address } from "@/types";
import { DEMO_USERS } from "@/data/users";

interface AuthStore {
  user: DemoUser | null;
  isAuthenticated: boolean;
  login: (user: DemoUser) => void;
  logout: () => void;
  switchUser: (email: string) => void;
  addAddress: (address: Address) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: (user) => {
        set({ user, isAuthenticated: true });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      switchUser: (email) => {
        const found = DEMO_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
        if (found) {
          set({ user: found, isAuthenticated: true });
        }
      },

      addAddress: (address) => {
        const currentUser = get().user;
        if (!currentUser) return;
        const updated = {
          ...currentUser,
          savedAddresses: [...currentUser.savedAddresses, address],
        };
        set({ user: updated });
      },
    }),
    {
      name: "aura_auth_state",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
