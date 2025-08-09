import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import type { IFriendRequest, IMessage, INotification, IUser } from "../types";

type T = Record<string, unknown> | string | Record<string, string>[];

interface UserStore {
  user: IUser | null;
  friends: IUser[];
  notifications: INotification[];
  friendRequests: IFriendRequest[];
  messages: IMessage[];
  setState: (state: Record<string, T>) => void;
}

export const useUserStore = create<UserStore>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        friends: [],
        friendRequests: [],
        notifications: [],
        messages: [],
        setState: (state) => {
          set((prevState) => ({ ...prevState, ...state }));
        },
      }),
      {
        name: "user-store",
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);
