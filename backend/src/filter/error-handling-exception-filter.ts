import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { BaseException } from '../shared/domain/exceptions/base.exception';

interface ErrorResponsePayload {
  statusCode: number;
  message: string;
  error?: string;
  details?: unknown;
  timestamp: string;
  path: string;
}

@Catch()
export class LoggingExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(LoggingExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errorName = 'InternalServerError';
    let details: unknown = undefined;

    // 1. Domain Exceptions (Clean Architecture BaseException)
    if (exception instanceof BaseException) {
      status = exception.statusCode || HttpStatus.BAD_REQUEST;
      message = exception.message;
      errorName = exception.name;
      this.logger.warn(
        `[DomainException] ${errorName} (${status}): ${message}`,
      );
    }
    // 2. NestJS HttpExceptions (ValidationPipe, NotFoundException, etc.)
    else if (exception instanceof HttpException) {
      status = exception.getStatus();
      errorName = exception.name;

      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const resObj = exceptionResponse as Record<string, any>;
        if (Array.isArray(resObj.message)) {
          // Validation pipe returns message as string[]
          message = 'Validation failed';
          details = resObj.message;
        } else {
          message = resObj.message || exception.message;
          details = resObj.error !== message ? resObj.error : undefined;
        }
        if (resObj.error && typeof resObj.error === 'string') {
          errorName = resObj.error;
        }
      } else {
        message = exceptionResponse;
      }
    }
    // 3. Unhandled Standard Errors & Unknown Exceptions
    else if (exception instanceof Error) {
      errorName = exception.name;
      message = exception.message;
      this.logger.error(
        `[UnhandledException] ${exception.message}`,
        exception.stack,
      );

      // In production, mask internal error details
      if (process.env.NODE_ENV === 'production') {
        message = 'Internal server error';
      }
    } else {
      this.logger.error(`[UnknownException] ${String(exception)}`);
    }

    const errorPayload: ErrorResponsePayload = {
      statusCode: status,
      message,
      error: errorName,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    if (details !== undefined) {
      errorPayload.details = details;
    }

    response.status(status).json(errorPayload);
  }
}
