import { create } from "zustand";
import type { IPost } from "../types";
// import { createJSONStorage, } from "zustand/middleware";
interface PostStore {
  posts: IPost[];
}
export const usePostStore = create<PostStore>()(() => ({
  posts: [],
}));
