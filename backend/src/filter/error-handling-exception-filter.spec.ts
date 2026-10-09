import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { HttpException, HttpStatus } from '@nestjs/common';
import { LoggingExceptionFilter } from './error-handling-exception-filter';
import { BaseException } from '../shared/domain/exceptions/base.exception';

describe('LoggingExceptionFilter', () => {
  let filter: LoggingExceptionFilter;
  let mockResponse: {
    status: jest.Mock;
    json: jest.Mock;
  };
  let mockRequest: {
    url: string;
  };
  let mockHost: any;

  beforeEach(() => {
    filter = new LoggingExceptionFilter();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockRequest = {
      url: '/api/v1/test',
    };
    mockHost = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
    };
  });

  it('should return strictly statusCode and code for BaseException', () => {
    class CustomDomainException extends BaseException {
      constructor() {
        super('Something not found in domain', 404, 'NOT FOUND');
      }
    }

    filter.catch(new CustomDomainException(), mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: 404,
      code: 'NOT FOUND',
    });
  });

  it('should return 422 VALIDATION FAILED for validation HttpException', () => {
    const validationException = new HttpException(
      {
        message: ['title should not be empty'],
        error: 'Bad Request',
        statusCode: 400,
      },
      HttpStatus.BAD_REQUEST,
    );

    filter.catch(validationException, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(422);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: 422,
      code: 'VALIDATION FAILED',
    });
  });

  it('should return 500 INTERNAL ERROR for unhandled Error', () => {
    filter.catch(new Error('Unexpected DB crash'), mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: 500,
      code: 'INTERNAL ERROR',
    });
  });
});
