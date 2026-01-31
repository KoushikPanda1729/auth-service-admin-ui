export interface Wallet {
  balance: number;
  currency: string;
  userId: string;
  status: "active" | "frozen";
}

export type TransactionType = "cashback" | "redemption" | "refund";
export type TransactionStatus = "pending" | "completed" | "failed" | "rolled_back";

export interface WalletTransaction {
  _id: string;
  walletId: string;
  userId: string;
  type: TransactionType;
  amount: number;
  orderId: string;
  balanceBefore: number;
  balanceAfter: number;
  status: TransactionStatus;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface RefundSplit {
  totalRefund: number;
  walletRefund: number;
  gatewayRefund: number;
  gatewayRefundDetails: unknown;
}
