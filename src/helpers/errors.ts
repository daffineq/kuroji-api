import { ContentfulStatusCode } from 'hono/utils/http-status';

export class HttpError extends Error {
  public status: ContentfulStatusCode;
  public details?: any;

  constructor(message: string, status: ContentfulStatusCode, details?: any) {
    super(message);
    this.status = status;
    this.details = details;

    Object.setPrototypeOf(this, new.target.prototype);
    this.name = this.constructor.name;
    Error.captureStackTrace?.(this, this.constructor);
  }
}

export class BadRequestError extends HttpError {
  constructor(message = 'Bad Request', details?: any) {
    super(message, 400, details);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message = 'Unauthorized', details?: any) {
    super(message, 401, details);
  }
}

export class ForbiddenError extends HttpError {
  constructor(message = 'Forbidden', details?: any) {
    super(message, 403, details);
  }
}

export class NotFoundError extends HttpError {
  constructor(message = 'Not Found', details?: any) {
    super(message, 404, details);
  }
}

export class ConflictError extends HttpError {
  constructor(message = 'Conflict', details?: any) {
    super(message, 409, details);
  }
}

export class RateLimitExceededError extends HttpError {
  constructor(message = 'Rate Limit Exceeded', details?: any) {
    super(message, 429, details);
  }
}

export class InternalServerError extends HttpError {
  constructor(message = 'Internal Server Error', details?: any) {
    super(message, 500, details);
  }
}
