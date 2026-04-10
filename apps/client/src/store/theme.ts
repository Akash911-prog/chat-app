// stores/theme.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type ThemeStore = {
    theme: "light" | "dark";
    toggle: () => void;
};

export const useThemeStore = create<ThemeStore>()(
    persist(
        (set, get) => ({
            theme: "dark",
            toggle: () => {
                const next = get().theme === "light" ? "dark" : "light";
                document.documentElement.classList.toggle(
                    "dark",
                    next === "dark",
                );
                set({ theme: next });
            },
        }),
        { name: "theme" }, // persists to localStorage
    ),
);
