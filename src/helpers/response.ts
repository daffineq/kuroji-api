interface BaseResponse {
  success: boolean;
  timestamp: string;
}

interface PaginatedResponse<T> extends BaseResponse {
  success: true;
  data: T[];
  pageInfo: PageInfo;
}

interface PageInfo {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
  hasNextPage: boolean;
}

interface SuccessResponse<T> extends BaseResponse {
  success: true;
  data: T;
  message?: string;
}

interface ErrorResponse extends BaseResponse {
  success: false;
  error: {
    status: number;
    message: string;
    details?: any;
  };
}

export type ApiResponse<T> = ErrorResponse | SuccessResponse<T> | PaginatedResponse<T>;

function createPaginatedResponse<T>(data: T[], pageInfo: PageInfo): PaginatedResponse<T> {
  return {
    success: true,
    data,
    pageInfo,
    timestamp: new Date().toISOString()
  };
}

function createSuccessResponse<T>(data: T, message?: string): SuccessResponse<T> {
  return {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString()
  };
}

function createErrorResponse(status: number, message: string, details?: any): ErrorResponse {
  return {
    success: false,
    error: {
      status,
      message,
      details
    },
    timestamp: new Date().toISOString()
  };
}

export {
  createErrorResponse,
  createSuccessResponse,
  createPaginatedResponse,
  type ErrorResponse,
  type SuccessResponse,
  type PaginatedResponse,
  type PageInfo
};
