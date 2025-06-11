import { createZustandStore } from "@/lib/create-store";

const useSkinStore = createZustandStore({ skin: "default" }, (set) => ({
  actions: {
    setSkin: (skin: string) => {
      set({ skin });
    },
  },
}));

export default useSkinStore;
