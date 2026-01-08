export interface ProductPriceConfiguration {
  [key: string]: {
    priceType: "base" | "additional";
    availableOptions: {
      [option: string]: number;
    };
    _id: string;
  };
}

export interface ProductAttribute {
  name: string;
  value: string;
  _id: string;
}

export interface CategoryReference {
  _id: string;
  name: string;
  priceCofigration: {
    [key: string]: {
      priceType: "base" | "additional";
      availableOptions: string[];
      _id: string;
    };
  };
  attributes: {
    name: string;
    wigetType: "radio" | "switch";
    defaultValue: string;
    availableOptions: string[];
    _id: string;
  }[];
  tenantId?: string;
  __v: number;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  image: string;
  category: CategoryReference;
  priceConfiguration: ProductPriceConfiguration;
  attributes: ProductAttribute[];
  tenantId: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface GetProductsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface GetProductsResponse {
  message: string;
  data: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetProductByIdResponse {
  message: string;
  product: Product;
}

export interface UploadImageResponse {
  message: string;
  data: {
    url: string;
    key: string;
  };
}

export interface CreateProductRequest {
  name: string;
  description: string;
  image: string;
  category: string;
  priceConfiguration: {
    [key: string]: {
      priceType: "base" | "additional";
      availableOptions: {
        [option: string]: number;
      };
    };
  };
  attributes: {
    name: string;
    value: string;
  }[];
  isPublished: boolean;
  tenantId?: string;
}

export interface CreateProductResponse {
  message: string;
  product: Product;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  image?: string;
  isPublished?: boolean;
}

export interface UpdateProductResponse {
  message: string;
  product: Product;
}

export interface DeleteProductResponse {
  message: string;
  product: Product;
}
