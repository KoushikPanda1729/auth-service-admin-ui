import { io, Socket } from "socket.io-client";
import { CALLING_SERVICE_URL } from "../../config/apiConfig";

const ICE_SERVERS: RTCIceServer[] = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
];

type CallState = "idle" | "calling" | "connected" | "ended";

export interface CallCallbacks {
  onConnected: () => void;
  onRejected: () => void;
  onEnded: () => void;
  onUserOffline: () => void;
  onRemoteStream: (stream: MediaStream) => void;
}

class AdminCallService {
  private socket: Socket | null = null;
  private pc: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private currentCallTarget: string | null = null;
  public state: CallState = "idle";
  private registeredUserId: string | null = null;

  connect(userId: string | number) {
    if (this.socket?.connected && this.registeredUserId === String(userId)) return;

    this.registeredUserId = String(userId);

    this.socket = io(CALLING_SERVICE_URL, {
      transports: ["websocket"],
      autoConnect: true,
    });

    this.socket.on("connect", () => {
      console.log("[CallService] Connected to calling service:", this.socket?.id);
      this.socket!.emit("register", String(userId));
    });

    this.socket.on("disconnect", () => {
      console.log("[CallService] Disconnected from calling service");
    });
  }

  async startCall(targetUserId: string | number, callerName: string, callbacks: CallCallbacks) {
    if (!this.socket?.connected) {
      throw new Error("Not connected to calling service");
    }

    this.currentCallTarget = String(targetUserId);
    this.state = "calling";

    // Get microphone access
    this.localStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });

    // Create peer connection
    this.pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });

    // Add local audio tracks
    this.localStream.getTracks().forEach((track) => {
      this.pc!.addTrack(track, this.localStream!);
    });

    // When remote audio arrives
    this.pc.ontrack = (e) => {
      callbacks.onRemoteStream(e.streams[0]);
    };

    // Send ICE candidates to the other peer
    this.pc.onicecandidate = (e) => {
      if (e.candidate) {
        this.socket!.emit("call:ice-candidate", {
          to: this.currentCallTarget,
          candidate: e.candidate.toJSON(),
        });
      }
    };

    // Create and send offer
    const offer = await this.pc.createOffer();
    await this.pc.setLocalDescription(offer);

    this.socket.emit("call:offer", {
      to: String(targetUserId),
      offer: { type: offer.type, sdp: offer.sdp },
      from: this.registeredUserId,
      callerName,
    });

    // Listen for answer
    this.socket.once("call:answered", async ({ answer }) => {
      await this.pc!.setRemoteDescription(new RTCSessionDescription(answer));
      this.state = "connected";
      callbacks.onConnected();
    });

    this.socket.once("call:rejected", () => {
      this.state = "idle";
      callbacks.onRejected();
      this._cleanup();
    });

    this.socket.once("call:ended", () => {
      this.state = "idle";
      callbacks.onEnded();
      this._cleanup();
    });

    this.socket.once("call:user-offline", () => {
      this.state = "idle";
      callbacks.onUserOffline();
      this._cleanup();
    });

    // Add incoming ICE candidates from customer
    this.socket.on("call:ice-candidate", async ({ candidate }) => {
      try {
        await this.pc?.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (e) {
        console.error("[CallService] Error adding ICE candidate:", e);
      }
    });
  }

  endCall() {
    if (this.currentCallTarget && this.socket?.connected) {
      this.socket.emit("call:end", { to: this.currentCallTarget });
    }
    this.state = "idle";
    this._cleanup();
  }

  private _cleanup() {
    this.localStream?.getTracks().forEach((t) => t.stop());
    this.pc?.close();
    this.pc = null;
    this.localStream = null;
    this.currentCallTarget = null;
    // Remove ICE candidate listener to avoid duplicates on next call
    this.socket?.off("call:ice-candidate");
  }

  disconnect() {
    this._cleanup();
    this.socket?.disconnect();
    this.socket = null;
    this.registeredUserId = null;
    this.state = "idle";
  }
}

export const adminCallService = new AdminCallService();
