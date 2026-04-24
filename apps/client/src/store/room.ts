import type { PublicRoom } from "@repo/shared";
import { create } from "zustand";

type RoomStore = {
    rooms: PublicRoom[];
    setRooms: (rooms: PublicRoom[]) => void;
    addRoom: (room: PublicRoom) => void;
    removeRoom: (roomId: string) => void;
};

export const useRoomStore = create<RoomStore>((set) => ({
    rooms: [],
    setRooms: (rooms) => set({ rooms }),
    addRoom: (room) => set((state) => ({ rooms: [...state.rooms, room] })),
    removeRoom: (roomId) =>
        set((state) => ({ rooms: state.rooms.filter((r) => r.id !== roomId) })),
}));
