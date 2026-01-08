export interface PriceConfiguration {
  [key: string]: {
    priceType: "base" | "additional";
    availableOptions: string[];
    _id: string;
  };
}

export interface Attribute {
  name: string;
  wigetType: "radio" | "switch";
  defaultValue: string;
  availableOptions: string[];
  _id: string;
}

export interface Category {
  _id: string;
  name: string;
  priceCofigration: PriceConfiguration;
  attributes: Attribute[];
  tenantId: string;
  isPublished?: boolean;
  createdAt?: string;
  __v: number;
}

export interface GetCategoriesParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface GetCategoriesResponse {
  message: string;
  data: Category[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetCategoryByIdResponse {
  message: string;
  category: Category;
}

export interface CreateCategoryRequest {
  name: string;
  priceCofigration: PriceConfiguration;
  attributes: Omit<Attribute, "_id">[];
  tenantId?: string;
  isPublished?: boolean;
}

export interface CreateCategoryResponse {
  message: string;
  category: Category;
}

export interface UpdateCategoryRequest {
  name?: string;
  priceCofigration?: PriceConfiguration;
  attributes?: Omit<Attribute, "_id">[];
  isPublished?: boolean;
}

export interface UpdateCategoryResponse {
  message: string;
  category: Category;
}

export interface DeleteCategoryResponse {
  message: string;
  category: Category;
}
