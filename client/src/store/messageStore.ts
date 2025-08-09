import { create } from "zustand";
import type { IMessage } from "../types";
import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";

interface MessageStore {
  messages: IMessage[];
  selectedChat: string | null;
  socket: Socket | null;
  initSocket: (id: string) => void;
  onlineUsers: { sid: string; userId: string }[];
}

export const useMessageStore = create<MessageStore>()((set, get) => {
  return {
    initSocket: (id) => {
      const socket = io(import.meta.env.VITE_SOCKET_URL);
      socket.emit("me", { id });
      socket.on("onlineUsers", (onlineUsers) => {
        set((state) => ({ ...state, onlineUsers }));
      });
      socket.on("message", (message: IMessage) => {
        set({ messages: [...get().messages, message] });
      });
      set((state) => ({ ...state, socket }));
    },
    onlineUsers: [],
    messages: [],
    selectedChat: null,
    socket: null,
  };
});
