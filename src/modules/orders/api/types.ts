export interface OrderTopping {
  _id: string;
  name: string;
  price: number;
  image: string;
}

export interface OrderTax {
  name: string;
  rate: number;
  amount: number;
}

export interface OrderItem {
  _id: string;
  name: string;
  image: string;
  qty: number;
  priceConfiguration: Record<string, string>;
  toppings: OrderTopping[];
  totalPrice: number;
}

export interface Order {
  _id: string;
  customerId: string;
  address: string;
  items: OrderItem[];
  subTotal: number;
  discount: number;
  couponCode: string;
  deliveryCharge: number;
  taxes: OrderTax[];
  taxTotal: number;
  total: number;
  walletCreditsApplied?: number;
  finalTotal: number;
  paymentMode: string;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  status: "pending" | "confirmed" | "preparing" | "out_for_delivery" | "delivered" | "cancelled";
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetOrdersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  tenantId?: string;
}

export interface GetOrdersResponse {
  message: string;
  data: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetOrderByIdResponse {
  message: string;
  order: Order;
}

export interface CreateOrderRequest {
  customerId: string;
  address: string;
  items: {
    name: string;
    image: string;
    qty: number;
    priceConfiguration: {
      [key: string]: {
        priceType: "base" | "additional";
        selectedOption: string;
        selectedPrice: number;
      };
    };
    toppings: { _id: string; name: string; price: number; image: string }[];
    totalPrice: number;
  }[];
  couponCode?: string;
  paymentMode: string;
  tenantId?: string;
}

export interface CreateOrderResponse {
  message: string;
  order: Order;
}

export interface UpdateOrderStatusRequest {
  status: "pending" | "confirmed" | "preparing" | "out_for_delivery" | "delivered";
}

export interface UpdateOrderStatusResponse {
  message: string;
  order: Order;
}
