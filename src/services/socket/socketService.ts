import { io, Socket } from "socket.io-client";
import { KONG_GATEWAY_URL, WS_SERVICE } from "../../config/apiConfig";

let socket: Socket | null = null;

export const socketService = {
  connect: () => {
    if (socket?.connected) return socket;

    socket = io(KONG_GATEWAY_URL, {
      path: `${WS_SERVICE}/socket.io`,
      transports: ["websocket"],
      autoConnect: true,
    });

    socket.on("connect", () => {
      console.log("WebSocket connected:", socket?.id);
    });

    socket.on("disconnect", () => {
      console.log("WebSocket disconnected");
    });

    return socket;
  },

  disconnect: () => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  },

  joinTenant: (tenantId: string) => {
    if (socket?.connected) {
      socket.emit("join", tenantId);
    }
  },

  getSocket: () => socket,

  on: (event: string, callback: (data: unknown) => void) => {
    socket?.on(event, callback);
  },

  off: (event: string, callback?: (data: unknown) => void) => {
    socket?.off(event, callback);
  },
};
