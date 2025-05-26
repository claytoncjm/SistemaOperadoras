export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface PagedResponse<T> extends ApiResponse<T[]> {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}
