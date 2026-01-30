import axiosInstance from "../../../services/api/axios.config";
import { BILLING_SERVICE } from "../../../config/apiConfig";
import { RefundOrderResponse, GetPaymentDetailsResponse, GetRefundsResponse } from "./types";

// Generate a unique idempotency key
const generateIdempotencyKey = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const paymentsApi = {
  // Full refund - only orderId
  fullRefund: async (orderId: string): Promise<RefundOrderResponse> => {
    const idempotencyKey = generateIdempotencyKey();

    const response = await axiosInstance.post<RefundOrderResponse>(
      `${BILLING_SERVICE}/payments/refund`,
      { orderId },
      {
        headers: {
          "x-idempotency-key": idempotencyKey,
        },
      }
    );
    return response.data;
  },

  // Partial refund - orderId + amount
  partialRefund: async (orderId: string, amount: number): Promise<RefundOrderResponse> => {
    const idempotencyKey = generateIdempotencyKey();

    const response = await axiosInstance.post<RefundOrderResponse>(
      `${BILLING_SERVICE}/payments/refund`,
      { orderId, amount },
      {
        headers: {
          "x-idempotency-key": idempotencyKey,
        },
      }
    );
    return response.data;
  },

  // Get payment details by stripe session ID
  getPaymentDetails: async (stripeSessionId: string): Promise<GetPaymentDetailsResponse> => {
    const response = await axiosInstance.get<GetPaymentDetailsResponse>(
      `${BILLING_SERVICE}/payments/${stripeSessionId}`
    );
    return response.data;
  },

  // Get refunds for an order
  getRefunds: async (orderId: string): Promise<GetRefundsResponse> => {
    const response = await axiosInstance.get<GetRefundsResponse>(
      `${BILLING_SERVICE}/payments/refunds/${orderId}`
    );
    return response.data;
  },
};
