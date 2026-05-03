import type { Room } from "@repo/shared";
import { create } from "zustand";

type RoomStore = {
    rooms: Room[];
    setRooms: (rooms: Room[]) => void;
    addRoom: (room: Room) => void;
    removeRoom: (roomId: string) => void;
    getRoom: (roomId: string) => Room | undefined;
};

export const useRoomStore = create<RoomStore>((set, get) => ({
    rooms: [],
    setRooms: (rooms) => set({ rooms }),
    addRoom: (room) => set((state) => ({ rooms: [...state.rooms, room] })),
    removeRoom: (roomId) =>
        set((state) => ({ rooms: state.rooms.filter((r) => r.id !== roomId) })),
    getRoom: (roomId) => get().rooms.find((room) => room.id === roomId),
}));
