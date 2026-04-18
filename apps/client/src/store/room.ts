import type { PublicRoom } from "@repo/shared";
import { create } from "zustand";

type roomStore = {
    rooms: PublicRoom[];
    addRoom: (room: PublicRoom) => void;
    removeRoom: (roomId: string) => void;
};

export const useRoomStore = create<roomStore>((set) => ({
    rooms: [],
    addRoom: (room) => {
        set((state) => ({ rooms: [...state.rooms, room] }));
    },
    removeRoom: (roomId) => {
        set((state) => ({ rooms: state.rooms.filter((r) => r.id !== roomId) }));
    },
}));
