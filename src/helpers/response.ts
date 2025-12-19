interface MetaInfo {
  total: number;
  page: number;
  perPage: number;
  hasNextPage: boolean;
}

interface BaseResponse {
  success: boolean;
  timestamp: string;
}

interface PaginatedResponse<T> extends BaseResponse {
  success: true;
  data: T[] | undefined;
  pageInfo: PageInfo | undefined;
}

interface MetaResponse<T> extends BaseResponse {
  success: true;
  data: T | undefined;
  meta?: MetaInfo | undefined;
  message?: string | undefined;
}

interface PageInfo {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
  hasNextPage: boolean;
}

interface MessageResponse extends BaseResponse {
  message?: string | undefined;
}

interface SuccessResponse<T> extends BaseResponse {
  success: true;
  data: T | undefined;
  message?: string | undefined;
}

interface ErrorResponse extends BaseResponse {
  success: false;
  error: {
    status: number | null;
    message: string | null;
    details?: any | null | undefined;
  };
}

export type ApiResponse<T> =
  | ErrorResponse
  | MessageResponse
  | SuccessResponse<T>
  | PaginatedResponse<T>
  | MetaResponse<T>;

function createMessageResponse(data: Partial<MessageResponse>): MessageResponse {
  return {
    success: data.success ?? true,
    message: data.message,
    timestamp: data.timestamp ?? new Date().toISOString()
  };
}

function createPaginatedResponse<T>(data: Partial<PaginatedResponse<T>>): PaginatedResponse<T> {
  return {
    success: true,
    data: data.data,
    pageInfo: data.pageInfo,
    timestamp: data.timestamp ?? new Date().toISOString()
  };
}

function createMetaResponse<T>(data: Partial<MetaResponse<T>>): MetaResponse<T> {
  return {
    success: true,
    data: data.data,
    meta: data.meta,
    message: data.message,
    timestamp: data.timestamp ?? new Date().toISOString()
  };
}

function createSuccessResponse<T>(data: Partial<SuccessResponse<T>>): SuccessResponse<T> {
  return {
    success: true,
    data: data.data,
    message: data.message,
    timestamp: data.timestamp ?? new Date().toISOString()
  };
}

function createErrorResponse(error: Partial<ErrorResponse>): ErrorResponse {
  return {
    success: false,
    error: {
      status: error.error?.status ?? null,
      message: error.error?.message ?? null,
      details: error.error?.details
    },
    timestamp: error.timestamp ?? new Date().toISOString()
  };
}

export {
  createMessageResponse,
  createErrorResponse,
  createSuccessResponse,
  createPaginatedResponse,
  createMetaResponse,
  type MessageResponse,
  type ErrorResponse,
  type SuccessResponse,
  type PaginatedResponse,
  type MetaResponse,
  type PageInfo,
  type MetaInfo
};
