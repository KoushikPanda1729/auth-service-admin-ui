import { useEffect, useRef, useCallback } from "react";
import { useAppSelector } from "../../../app/hooks";
import { socketService } from "../../../services/socket/socketService";
import type { Order } from "../api/types";
import { notification } from "../../../services/notification/notification";

interface UseOrderSocketOptions {
  onOrderUpdate?: () => void;
}

export const useOrderSocket = (options?: UseOrderSocketOptions) => {
  const { user } = useAppSelector((state) => state.login);
  const connectedRef = useRef(false);
  const onOrderUpdateRef = useRef(options?.onOrderUpdate);

  // Keep the callback ref up to date
  useEffect(() => {
    onOrderUpdateRef.current = options?.onOrderUpdate;
  }, [options?.onOrderUpdate]);

  useEffect(() => {
    if (!user || connectedRef.current) return;

    const socket = socketService.connect();
    connectedRef.current = true;

    const joinRoom = () => {
      if (user.role === "admin") {
        // Admins join the "admin" room to receive all tenant events
        socketService.joinTenant("admin");
      } else if (user.role === "manager" && user.tenant) {
        // Managers join their specific tenant room
        socketService.joinTenant(String(user.tenant.id));
      }
    };

    socket.on("connect", joinRoom);
    if (socket.connected) {
      joinRoom();
    }

    const handleOrderCreated = (data: Order) => {
      // Only notify for cash (offline) orders — online/wallet payments will trigger payment-completed event
      if (data.paymentMode !== "cash") return;
      notification.success(`New order received! #${data._id.slice(-6)}`);
      onOrderUpdateRef.current?.();
    };

    const handleOrderStatusUpdated = (data: Order) => {
      notification.info(`Order #${data._id.slice(-6)} status: ${data.status}`);
      onOrderUpdateRef.current?.();
    };

    const handleOrderPaymentCompleted = (data: Order) => {
      notification.success(`Payment completed for order #${data._id.slice(-6)}`);
      onOrderUpdateRef.current?.();
    };

    const handleOrderPaymentRefunded = (data: Order) => {
      notification.info(`Order #${data._id.slice(-6)} refunded`);
      onOrderUpdateRef.current?.();
    };

    const handleOrderDeleted = (data: Order) => {
      notification.info(`Order #${data._id.slice(-6)} deleted`);
      onOrderUpdateRef.current?.();
    };

    socketService.on("order-created", handleOrderCreated as (data: unknown) => void);
    socketService.on("order-status-updated", handleOrderStatusUpdated as (data: unknown) => void);
    socketService.on(
      "order-payment-completed",
      handleOrderPaymentCompleted as (data: unknown) => void
    );
    socketService.on(
      "order-payment-refunded",
      handleOrderPaymentRefunded as (data: unknown) => void
    );
    socketService.on("order-deleted", handleOrderDeleted as (data: unknown) => void);

    return () => {
      socketService.off("order-created", handleOrderCreated as (data: unknown) => void);
      socketService.off(
        "order-status-updated",
        handleOrderStatusUpdated as (data: unknown) => void
      );
      socketService.off(
        "order-payment-completed",
        handleOrderPaymentCompleted as (data: unknown) => void
      );
      socketService.off(
        "order-payment-refunded",
        handleOrderPaymentRefunded as (data: unknown) => void
      );
      socketService.off("order-deleted", handleOrderDeleted as (data: unknown) => void);
      connectedRef.current = false;
    };
  }, [user]);

  const joinTenant = useCallback((tenantId: string) => {
    socketService.joinTenant(tenantId);
  }, []);

  return { joinTenant };
};
