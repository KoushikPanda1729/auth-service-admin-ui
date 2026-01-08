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
  data: Category;
}

export interface CreateCategoryRequest {
  name: string;
  priceCofigration: PriceConfiguration;
  attributes: Omit<Attribute, "_id">[];
  isPublished?: boolean;
}

export interface CreateCategoryResponse {
  message: string;
  data: Category;
}

export interface UpdateCategoryRequest {
  name?: string;
  priceCofigration?: PriceConfiguration;
  attributes?: Omit<Attribute, "_id">[];
  isPublished?: boolean;
}

export interface UpdateCategoryResponse {
  message: string;
  data: Category;
}

export interface DeleteCategoryResponse {
  message: string;
}
