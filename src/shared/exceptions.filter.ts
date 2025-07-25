import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    let message: string | object = 'Internal server error';

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null &&
      'message' in exceptionResponse
    ) {
      message = (exceptionResponse as any).message;
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    const stack = exception instanceof Error ? exception.stack : undefined;
    const projectRoot = process.cwd().replace(/\\/g, '/');

    const cleanedStack = stack
      ? stack
          .replace(/\\/g, '/')
          .split('\n')
          .filter((line) => {
            return line.includes(projectRoot) && !line.includes('node_modules');
          })
          .map((line) => {
            const match =
              line.match(/\((.*):(\d+):(\d+)\)/) ||
              line.match(/(.*):(\d+):(\d+)/);

            if (match && match[1].includes(projectRoot)) {
              const absolutePath = match[1].replace(/\\/g, '/');
              const relativePath = absolutePath.replace(projectRoot + '/', '');
              return `${relativePath}:${match[2]}:${match[3]}`;
            }

            return line.trim();
          })
          .join('\n')
      : undefined;

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      stack: cleanedStack,
    };

    if (!response.headersSent && !response.writableEnded) {
      response.status(status).json(errorResponse);
    }
  }
}
