import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import type { IUser } from "../types";

interface AuthStore {
  user: IUser | null;
  tokenId: string | null;
  getTokenId: () => void;
}

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set) => ({
        tokenId: "",
        getTokenId: () => {
          const tokenId = localStorage.getItem("token-id");
          set({ tokenId });
        },
        user: null,
      }),
      {
        name: "auth",
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);
