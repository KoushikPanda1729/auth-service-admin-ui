export interface TaxItem {
  name: string;
  rate: number;
  isActive: boolean;
}

export interface TaxConfig {
  _id: string;
  tenantId: string;
  taxes: TaxItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaxConfigRequest {
  taxes: TaxItem[];
  tenantId?: string;
}

export interface CreateTaxConfigResponse {
  message: string;
  taxConfig: TaxConfig;
}

export interface GetTaxConfigResponse {
  message: string;
  taxConfig: TaxConfig;
}

export interface UpdateTaxConfigRequest {
  taxes: TaxItem[];
  tenantId?: string;
}

export interface UpdateTaxConfigResponse {
  message: string;
  taxConfig: TaxConfig;
}

export interface ToggleTaxRequest {
  taxName: string;
  isActive: boolean;
  tenantId?: string;
}

export interface ToggleTaxResponse {
  message: string;
  taxConfig: TaxConfig;
}

export interface DeleteTaxConfigRequest {
  tenantId?: string;
}

export interface DeleteTaxConfigResponse {
  message: string;
}
