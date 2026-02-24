import { io, Socket } from "socket.io-client";
import axios from "axios";
import { CHAT_SERVICE_URL } from "../../config/apiConfig";

export interface ChatMessage {
  _id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  senderRole: "admin" | "customer";
  text: string;
  read: boolean;
  createdAt: string;
}

type MessageHandler = (msg: ChatMessage) => void;
type TypingHandler = (data: { senderName: string; isTyping: boolean }) => void;
type ReadHandler = (data: { roomId: string; readerRole: string }) => void;

class AdminChatService {
  private socket: Socket | null = null;
  private currentRoom: string | null = null;

  connect() {
    if (this.socket?.connected) return;

    this.socket = io(CHAT_SERVICE_URL, {
      transports: ["websocket"],
      autoConnect: true,
    });

    this.socket.on("connect", () => {
      console.log("[AdminChatService] Connected:", this.socket?.id);
      // Rejoin room if reconnecting mid-chat
      if (this.currentRoom) {
        this.socket!.emit("chat:join", this.currentRoom);
      }
    });

    this.socket.on("disconnect", () => {
      console.log("[AdminChatService] Disconnected");
    });
  }

  joinRoom(roomId: string) {
    this.currentRoom = roomId;
    if (this.socket?.connected) {
      this.socket.emit("chat:join", roomId);
    }
  }

  leaveRoom(roomId: string) {
    if (this.socket?.connected) {
      this.socket.emit("chat:leave", roomId);
    }
    if (this.currentRoom === roomId) this.currentRoom = null;
  }

  sendMessage(payload: { roomId: string; senderId: string; senderName: string; text: string }) {
    this.socket?.emit("chat:message", {
      ...payload,
      senderRole: "admin",
    });
  }

  sendTyping(roomId: string, senderName: string, isTyping: boolean) {
    this.socket?.emit("chat:typing", { roomId, senderName, isTyping });
  }

  markRead(roomId: string) {
    this.socket?.emit("chat:read", { roomId, readerRole: "admin" });
  }

  onMessage(handler: MessageHandler) {
    this.socket?.on("chat:message", handler);
  }

  offMessage(handler: MessageHandler) {
    this.socket?.off("chat:message", handler);
  }

  onTyping(handler: TypingHandler) {
    this.socket?.on("chat:typing", handler);
  }

  offTyping(handler: TypingHandler) {
    this.socket?.off("chat:typing", handler);
  }

  onRead(handler: ReadHandler) {
    this.socket?.on("chat:read", handler);
  }

  offRead(handler: ReadHandler) {
    this.socket?.off("chat:read", handler);
  }

  async fetchHistory(roomId: string): Promise<ChatMessage[]> {
    const res = await axios.get<{ messages: ChatMessage[] }>(
      `${CHAT_SERVICE_URL}/messages/${roomId}`
    );
    return res.data.messages;
  }

  async fetchUnreadCount(roomId: string): Promise<number> {
    const res = await axios.get<{ count: number }>(
      `${CHAT_SERVICE_URL}/messages/${roomId}/unread/count?role=admin`
    );
    return res.data.count;
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
    this.currentRoom = null;
  }
}

export const adminChatService = new AdminChatService();
