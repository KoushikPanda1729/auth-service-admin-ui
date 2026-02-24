import { useEffect, useRef, useState } from "react";
import { Modal, Button, Space, Typography, Avatar } from "antd";
import { PhoneOutlined, AudioOutlined, AudioMutedOutlined, UserOutlined } from "@ant-design/icons";
import { adminCallService } from "../../services/call/callService";

const { Text, Title } = Typography;

interface CallModalProps {
  open: boolean;
  customerId: string | number;
  customerLabel?: string;
  callerName: string;
  onClose: () => void;
}

type CallPhase = "calling" | "connected" | "rejected" | "offline" | "ended";

export const CallModal = ({
  open,
  customerId,
  customerLabel,
  callerName,
  onClose,
}: CallModalProps) => {
  const [phase, setPhase] = useState<CallPhase>("calling");
  const [muted, setMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!open) return;

    setPhase("calling");
    setDuration(0);
    setMuted(false);

    adminCallService
      .startCall(customerId, callerName, {
        onConnected: () => {
          setPhase("connected");
          timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
        },
        onRejected: () => setPhase("rejected"),
        onEnded: () => {
          setPhase("ended");
          clearInterval(timerRef.current!);
        },
        onUserOffline: () => setPhase("offline"),
        onRemoteStream: (stream) => {
          if (remoteAudioRef.current) {
            remoteAudioRef.current.srcObject = stream;
            remoteAudioRef.current.play().catch(console.error);
          }
        },
      })
      .catch((err) => {
        console.error("[CallModal] Failed to start call:", err);
        setPhase("offline");
      });

    return () => {
      clearInterval(timerRef.current!);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleEndCall = () => {
    adminCallService.endCall();
    clearInterval(timerRef.current!);
    onClose();
  };

  const toggleMute = () => {
    const tracks = (remoteAudioRef.current?.srcObject as MediaStream)?.getAudioTracks?.() ?? [];
    // Mute local mic by pausing the peer connection's sender tracks
    adminCallService["localStream"]?.getAudioTracks().forEach((t) => {
      t.enabled = muted; // toggle back
    });
    setMuted((prev) => !prev);
    void tracks;
  };

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const statusMessages: Record<CallPhase, string> = {
    calling: "Calling...",
    connected: formatDuration(duration),
    rejected: "Call rejected",
    offline: "Customer is offline",
    ended: "Call ended",
  };

  return (
    <Modal
      open={open}
      onCancel={handleEndCall}
      footer={null}
      centered
      width={320}
      closable={phase !== "calling"}
      maskClosable={false}
    >
      {/* Hidden audio element for remote stream */}
      <audio ref={remoteAudioRef} autoPlay playsInline style={{ display: "none" }} />

      <div style={{ textAlign: "center", padding: "24px 0" }}>
        <Avatar
          size={80}
          icon={<UserOutlined />}
          style={{ backgroundColor: "#FF6B35", marginBottom: 16 }}
        />

        <Title level={4} style={{ margin: 0 }}>
          {customerLabel ?? `Customer #${customerId}`}
        </Title>

        <Text
          type={phase === "connected" ? "success" : "secondary"}
          style={{ display: "block", marginTop: 8, fontSize: 16 }}
        >
          {statusMessages[phase]}
        </Text>

        {(phase === "calling" || phase === "connected") && (
          <Space style={{ marginTop: 32 }} size={24}>
            {phase === "connected" && (
              <Button
                shape="circle"
                size="large"
                icon={muted ? <AudioMutedOutlined /> : <AudioOutlined />}
                onClick={toggleMute}
                style={{
                  backgroundColor: muted ? "#ff4d4f" : "#f0f0f0",
                  color: muted ? "#fff" : "#666",
                  border: "none",
                  width: 56,
                  height: 56,
                }}
              />
            )}
            <Button
              shape="circle"
              size="large"
              danger
              icon={<PhoneOutlined rotate={135} />}
              onClick={handleEndCall}
              style={{ width: 56, height: 56, fontSize: 22 }}
            />
          </Space>
        )}

        {(phase === "rejected" || phase === "offline" || phase === "ended") && (
          <Button
            type="primary"
            style={{ marginTop: 24, backgroundColor: "#FF6B35", border: "none" }}
            onClick={onClose}
          >
            Close
          </Button>
        )}
      </div>
    </Modal>
  );
};
