import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  MessageEvent,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SSE_METADATA } from '@nestjs/common/constants';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';
import { ApiResponse } from '../interfaces/response.interface';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T> | T> {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<ApiResponse<T> | T> {
    // @Sse() 데코레이터가 적용된 핸들러인지 확인
    const isSse = this.reflector.get<boolean>(SSE_METADATA, context.getHandler());

    if (isSse) {
      // SSE의 경우 MessageEvent.data를 표준 형식으로 래핑
      return next.handle().pipe(
        map((event: T) => {
          const messageEvent = event as MessageEvent;
          return {
            ...messageEvent,
            data: {
              statusCode: 200,
              success: true,
              data: messageEvent.data,
            },
          } as T;
        }),
      );
    }

    const response = context.switchToHttp().getResponse<Response>();

    // 일반 HTTP 응답을 표준 형식으로 래핑
    return next.handle().pipe(
      map((data: T) => ({
        statusCode: response.statusCode,
        success: true,
        data,
      })),
    );
  }
}
