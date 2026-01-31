import axiosInstance from "../../services/api/axios.config";
import { BILLING_SERVICE } from "../../config/apiConfig";
import type { Wallet, WalletTransaction, RefundSplit } from "./types";

export const walletApi = {
  /**
   * Get customer's wallet balance (admin view)
   */
  getCustomerBalance: async (userId: string): Promise<Wallet> => {
    const response = await axiosInstance.get(`${BILLING_SERVICE}/wallets/${userId}/balance`);
    return response.data;
  },

  /**
   * Get customer's wallet transactions (admin view)
   */
  getCustomerTransactions: async (
    userId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ transactions: WalletTransaction[]; pagination: unknown }> => {
    const response = await axiosInstance.get(`${BILLING_SERVICE}/wallets/${userId}/transactions`, {
      params: { page, limit },
    });
    return response.data;
  },
};

export const refundApi = {
  /**
   * Process refund with wallet/gateway split
   */
  processRefund: async (
    orderId: string,
    amount?: number,
    idempotencyKey?: string
  ): Promise<RefundSplit> => {
    const headers: Record<string, string> = {};
    if (idempotencyKey) {
      headers["x-idempotency-key"] = idempotencyKey;
    }

    const response = await axiosInstance.post(
      `${BILLING_SERVICE}/payments/refund`,
      { orderId, amount },
      { headers }
    );
    return response.data;
  },

  /**
   * Get refund history for an order
   */
  getRefundHistory: async (orderId: string): Promise<unknown> => {
    const response = await axiosInstance.get(`${BILLING_SERVICE}/payments/refunds/${orderId}`);
    return response.data;
  },
};
