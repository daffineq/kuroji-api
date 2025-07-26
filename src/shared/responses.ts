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
