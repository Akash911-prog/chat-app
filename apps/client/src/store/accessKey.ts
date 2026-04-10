import { create } from "zustand";
import { logout } from "../libs/logout";

type keyStore = {
    accessKey: string;
    setAccessKey: (key: string) => void;
    logout: () => void;
};

export const useKeyStore = create<keyStore>((set) => ({
    accessKey: "",
    setAccessKey: (key) => set({ accessKey: key }),
    logout: logout,
}));
