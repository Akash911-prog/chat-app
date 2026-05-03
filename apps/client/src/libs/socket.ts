import { clientEnv } from "@repo/shared/env/client";
import { io } from "socket.io-client";

const socket = io(`${clientEnv.VITE_SERVER_URL}`, {
    withCredentials: true,
    autoConnect: false,
});

export default socket;
