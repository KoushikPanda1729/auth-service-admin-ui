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
  priceConfiguration: {
    [key: string]: {
      priceType: "base" | "additional";
      selectedOption: string;
      selectedPrice: number;
    };
  };
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
  paymentMode: string;
  paymentStatus: string;
  status: "pending" | "preparing" | "on-way" | "delivered";
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetOrdersParams {
  page?: number;
  limit?: number;
  search?: string;
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
