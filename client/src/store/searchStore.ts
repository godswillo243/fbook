import { create } from "zustand";
import type { SearchStore } from "../types";

export const useSearchStore = create<SearchStore>((set) => ({
  results: [],
  searchParams: "",
  setSearchParam: (param) =>
    set((state) => ({ ...state, searchParams: param })),
}));
