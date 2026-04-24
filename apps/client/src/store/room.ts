import type { Room } from "@repo/shared";
import { create } from "zustand";

type RoomStore = {
    rooms: Room[];
    setRooms: (rooms: Room[]) => void;
    addRoom: (room: Room) => void;
    removeRoom: (roomId: string) => void;
};

export const useRoomStore = create<RoomStore>((set) => ({
    rooms: [],
    setRooms: (rooms) => set({ rooms }),
    addRoom: (room) => set((state) => ({ rooms: [...state.rooms, room] })),
    removeRoom: (roomId) =>
        set((state) => ({ rooms: state.rooms.filter((r) => r.id !== roomId) })),
}));
