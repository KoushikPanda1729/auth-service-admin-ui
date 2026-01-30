export interface OrderValueTier {
  minOrderValue: number;
  deliveryCharge: number;
}

export interface DeliveryConfig {
  _id: string;
  tenantId: string;
  isActive: boolean;
  orderValueTiers: OrderValueTier[];
  freeDeliveryThreshold: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDeliveryConfigRequest {
  isActive: boolean;
  orderValueTiers: OrderValueTier[];
  freeDeliveryThreshold: number;
  tenantId?: string;
}

export interface CreateDeliveryConfigResponse {
  message: string;
  config: DeliveryConfig;
}

export interface GetDeliveryConfigResponse {
  message: string;
  config: DeliveryConfig;
}

export interface UpdateDeliveryConfigRequest {
  isActive: boolean;
  orderValueTiers: OrderValueTier[];
  freeDeliveryThreshold: number;
  tenantId?: string;
}

export interface UpdateDeliveryConfigResponse {
  message: string;
  config: DeliveryConfig;
}

export interface ToggleDeliveryRequest {
  isActive: boolean;
  tenantId?: string;
}

export interface ToggleDeliveryResponse {
  message: string;
  config: DeliveryConfig;
}

export interface DeleteDeliveryConfigRequest {
  tenantId?: string;
}

export interface DeleteDeliveryConfigResponse {
  message: string;
}
