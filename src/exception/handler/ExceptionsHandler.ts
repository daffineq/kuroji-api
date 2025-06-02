import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Response } from 'express';

@Catch()
export class ExceptionsHandler implements ExceptionFilter {
  constructor(private readonly prisma: PrismaService) {}

  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';
    let stack: string | undefined;
    let file: string | undefined;
    let line: number | undefined;
    let headers: string | undefined;
    let errorResponse: any = {};

    // Handle different types of exceptions
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      message = typeof res === 'string' ? res : (res as any).message;
      headers = typeof res === 'string' ? res : (res as any).headers;
      errorResponse = res;
    } else if (exception instanceof Error) {
      // Handle any Error instance
      message = exception.message;
      stack = exception.stack;

      // Parse stack trace for file info
      const stackLines = stack?.split('\n');
      const errorLine = stackLines?.find((line) => line.includes('Error:'));
      const callerLine = stackLines?.find(
        (line) => !line.includes('node_modules') && line.includes('.ts'),
      );

      if (callerLine) {
        const match =
          callerLine.match(/\((.*):(\d+):(\d+)\)/) ||
          callerLine.match(/at\s+(.+):(\d+):(\d+)/);
        if (match) {
          file = match[1];
          line = parseInt(match[2]);
        }
      }

      // Set error response
      errorResponse = {
        statusCode: status,
        message,
        error: exception.name,
      };
    } else {
      // Handle unknown exceptions
      errorResponse = {
        statusCode: status,
        message: String(exception),
        error: 'Unknown Error',
      };
    }

    // Log exception to database
    try {
      await this.prisma.exception.create({
        data: {
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
          method: request.method,
          message: message,
          file: file ?? null,
          line: line?.toString() ?? null,
          stack,
          headers,
        },
      });
    } catch (e) {
      console.error('Failed to save exception log:', e);
    }

    // Send response
    response.status(status).json({
      timestamp: new Date().toISOString(),
      path: request.url,
      ...errorResponse,
    });
  }
}
