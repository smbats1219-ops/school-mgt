import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const { method, url } = context
      .switchToHttp()
      .getRequest<{ method: string; url: string }>();
    const now = Date.now();

    console.log(`[${method}] ${url}`);

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - now;
        console.log(`[${method}] ${url} - ${duration}ms`);
      }),
    );
  }
}
