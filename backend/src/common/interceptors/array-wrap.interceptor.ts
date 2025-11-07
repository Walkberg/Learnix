import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ArrayWrapInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // If the response is a root array, wrap it into { items: [...] }
        if (Array.isArray(data)) {
          return { items: data };
        }
        // If it's already an object, return as-is
        return data;
      }),
    );
  }
}
