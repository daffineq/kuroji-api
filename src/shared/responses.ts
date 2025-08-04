export interface PaginatedResponse<T> {
  pageInfo: PageInfo;
  data: T[];
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

export function createPaginatedResponse<T>(
  data: PaginatedResponse<T>,
): PaginatedResponse<T> {
  return {
    pageInfo: data.pageInfo,
    data: data.data,
  };
}
