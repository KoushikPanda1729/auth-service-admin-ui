export interface RefundOrderRequest {
  orderId: string;
  amount?: number; // Optional for partial refund
}

export interface RefundOrderResponse {
  message: string;
  refund: {
    id: string;
    orderId: string;
    amount: number;
    status: string;
    createdAt: string;
  };
}

export interface PaymentDetails {
  id: string;
  object: string;
  amount_subtotal: number;
  amount_total: number;
  currency: string;
  customer_details: {
    email: string;
    name: string;
    phone: string | null;
  };
  metadata: {
    customerId: string;
    orderId: string;
    receipt: string;
    tenantId: string;
  };
  payment_intent: string;
  payment_status: string;
  status: string;
  created: number;
  // Add other fields as needed
}

export interface GetPaymentDetailsResponse {
  message: string;
  payment: PaymentDetails;
}

export interface RefundDetails {
  id: string;
  paymentId: string;
  amount: number;
  status: string;
}

export interface GetRefundsResponse {
  message: string;
  refunds: RefundDetails[];
}
