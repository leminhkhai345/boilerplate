import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { ExecutionContext, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { firstValueFrom, of } from 'rxjs';
import { ResponseTransformInterceptor } from './response-transform.interceptor';

describe('ResponseTransformInterceptor', () => {
  let interceptor: ResponseTransformInterceptor<any>;
  let reflector: Reflector;
  let mockResponse: {
    statusCode: number;
    headersSent: boolean;
  };
  let mockContext: ExecutionContext;

  beforeEach(() => {
    reflector = new Reflector();
    interceptor = new ResponseTransformInterceptor(reflector);
    mockResponse = {
      statusCode: HttpStatus.OK,
      headersSent: false,
    };
    mockContext = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
      }),
      getHandler: () => () => {},
      getClass: () => class {},
    } as unknown as ExecutionContext;
  });

  it('should wrap success response into { statusCode, code, data }', async () => {
    const rawData = { id: '123', name: 'Test Sample' };
    const next = {
      handle: () => of(rawData),
    };

    const result = await firstValueFrom(
      interceptor.intercept(mockContext, next),
    );
    expect(result).toEqual({
      statusCode: 200,
      code: 'SUCCESS',
      data: rawData,
    });
  });

  it('should use custom code from @ResponseCode decorator', async () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue('SAMPLE_CREATED');
    mockResponse.statusCode = HttpStatus.CREATED;

    const rawData = { id: '123', title: 'New Item' };
    const next = {
      handle: () => of(rawData),
    };

    const result = await firstValueFrom(
      interceptor.intercept(mockContext, next),
    );
    expect(result).toEqual({
      statusCode: 201,
      code: 'SAMPLE_CREATED',
      data: rawData,
    });
  });

  it('should handle collection with pagination', async () => {
    const collectionData = {
      data: [{ id: '1' }, { id: '2' }],
      pagination: {
        type: 'offset',
        pageNo: 1,
        pageSize: 20,
        totalItems: 2,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
    const next = {
      handle: () => of(collectionData),
    };

    const result = await firstValueFrom(
      interceptor.intercept(mockContext, next),
    );
    expect(result).toEqual({
      statusCode: 200,
      code: 'SUCCESS',
      data: [{ id: '1' }, { id: '2' }],
      pagination: collectionData.pagination,
    });
  });
});

