import { create } from "zustand";

type keyStore = {
    accessKey: string;
    setAccessKey: (key: string) => void;
};

export const useKeyStore = create<keyStore>((set) => ({
    accessKey: "",
    setAccessKey: (key) => set(() => ({ accessKey: key })),
}));
