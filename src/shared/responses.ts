export interface ApiResponse<T> {
  pageInfo: PageInfo;
  data: T;
}

export interface PageInfo {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
  hasNextPage: boolean;
}

export function createSuccessResponse(message: string) {
  return {
    success: true,
    message,
  };
}

export function createResponse<T>(data: ApiResponse<T>): ApiResponse<T> {
  return {
    pageInfo: data.pageInfo,
    data: data.data,
  };
}
