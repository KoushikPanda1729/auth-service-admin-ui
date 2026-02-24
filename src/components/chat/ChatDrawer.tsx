import { useEffect, useRef, useState, useCallback } from "react";
import { Drawer, Input, Button, Avatar, Typography, Space, Badge, Spin } from "antd";
import { SendOutlined, UserOutlined, CustomerServiceOutlined } from "@ant-design/icons";
import { adminChatService, ChatMessage } from "../../services/chat/chatService";

const { Text } = Typography;

interface ChatDrawerProps {
  open: boolean;
  onClose: () => void;
  roomId: string; // customerId
  roomLabel?: string; // e.g. "Customer #42"
  adminId: string;
  adminName: string;
}

export const ChatDrawer = ({
  open,
  onClose,
  roomId,
  roomLabel,
  adminId,
  adminName,
}: ChatDrawerProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [typingText, setTypingText] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleMessage = useCallback(
    (msg: ChatMessage) => {
      if (msg.roomId !== roomId) return;
      setMessages((prev) => {
        // Avoid duplicate _id
        if (prev.some((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
      // Mark read immediately since drawer is open
      if (msg.senderRole === "customer") {
        adminChatService.markRead(roomId);
      }
    },
    [roomId]
  );

  const handleTyping = useCallback((data: { senderName: string; isTyping: boolean }) => {
    setTypingText(data.isTyping ? `${data.senderName} is typing...` : "");
  }, []);

  useEffect(() => {
    if (!open) return;

    adminChatService.connect();
    adminChatService.joinRoom(roomId);

    // Load history
    setLoading(true);
    adminChatService
      .fetchHistory(roomId)
      .then((msgs) => setMessages(msgs))
      .catch(console.error)
      .finally(() => setLoading(false));

    // Mark all as read
    adminChatService.markRead(roomId);
    setUnreadCount(0);

    adminChatService.onMessage(handleMessage);
    adminChatService.onTyping(handleTyping);

    return () => {
      adminChatService.offMessage(handleMessage);
      adminChatService.offTyping(handleTyping);
      adminChatService.leaveRoom(roomId);
    };
  }, [open, roomId, handleMessage, handleTyping]);

  // Track unread when drawer is closed
  useEffect(() => {
    if (open) return;
    adminChatService.connect();
    const fetchUnread = async () => {
      const count = await adminChatService.fetchUnreadCount(roomId).catch(() => 0);
      setUnreadCount(count);
    };
    fetchUnread();

    const msgHandler = (msg: ChatMessage) => {
      if (msg.roomId !== roomId) return;
      if (msg.senderRole === "customer") setUnreadCount((c) => c + 1);
    };
    adminChatService.onMessage(msgHandler);
    return () => adminChatService.offMessage(msgHandler);
  }, [open, roomId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingText]);

  const handleSend = () => {
    const text = inputText.trim();
    if (!text) return;

    adminChatService.sendMessage({ roomId, senderId: adminId, senderName: adminName, text });
    setInputText("");
    // Stop typing indicator
    adminChatService.sendTyping(roomId, adminName, false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    adminChatService.sendTyping(roomId, adminName, true);
    clearTimeout(typingTimerRef.current!);
    typingTimerRef.current = setTimeout(() => {
      adminChatService.sendTyping(roomId, adminName, false);
    }, 1500);
  };

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <>
      {/* Unread badge shown outside drawer when closed */}
      <Badge count={unreadCount} offset={[-4, 4]} />

      <Drawer
        title={
          <Space>
            <CustomerServiceOutlined />
            <span>{roomLabel ?? `Chat with Customer #${roomId}`}</span>
          </Space>
        }
        placement="right"
        width={380}
        open={open}
        onClose={onClose}
        styles={{ body: { display: "flex", flexDirection: "column", padding: 0 } }}
      >
        {/* Messages area */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            minHeight: 0,
            maxHeight: "calc(100vh - 180px)",
          }}
        >
          {loading ? (
            <div style={{ textAlign: "center", paddingTop: 40 }}>
              <Spin />
            </div>
          ) : messages.length === 0 ? (
            <Text type="secondary" style={{ textAlign: "center", marginTop: 40, display: "block" }}>
              No messages yet. Say hello!
            </Text>
          ) : (
            messages.map((msg) => {
              const isAdmin = msg.senderRole === "admin";
              return (
                <div
                  key={msg._id}
                  style={{
                    display: "flex",
                    flexDirection: isAdmin ? "row-reverse" : "row",
                    alignItems: "flex-end",
                    gap: 8,
                  }}
                >
                  <Avatar
                    size="small"
                    icon={<UserOutlined />}
                    style={{ backgroundColor: isAdmin ? "#FF6B35" : "#1677ff", flexShrink: 0 }}
                  />
                  <div style={{ maxWidth: "70%" }}>
                    <div
                      style={{
                        backgroundColor: isAdmin ? "#FF6B35" : "#f0f0f0",
                        color: isAdmin ? "#fff" : "#000",
                        padding: "8px 12px",
                        borderRadius: isAdmin ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                        wordBreak: "break-word",
                      }}
                    >
                      {msg.text}
                    </div>
                    <Text
                      type="secondary"
                      style={{
                        fontSize: 11,
                        display: "block",
                        textAlign: isAdmin ? "right" : "left",
                        marginTop: 2,
                      }}
                    >
                      {formatTime(msg.createdAt)}
                    </Text>
                  </div>
                </div>
              );
            })
          )}

          {typingText && (
            <Text type="secondary" style={{ fontSize: 12, fontStyle: "italic" }}>
              {typingText}
            </Text>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div
          style={{
            padding: "12px 16px",
            borderTop: "1px solid #f0f0f0",
            display: "flex",
            gap: 8,
            backgroundColor: "#fff",
          }}
        >
          <Input
            value={inputText}
            onChange={handleInputChange}
            onPressEnter={handleSend}
            placeholder="Type a message..."
            style={{ borderRadius: 20 }}
          />
          <Button
            type="primary"
            shape="circle"
            icon={<SendOutlined />}
            onClick={handleSend}
            disabled={!inputText.trim()}
            style={{ backgroundColor: "#FF6B35", border: "none" }}
          />
        </div>
      </Drawer>
    </>
  );
};
