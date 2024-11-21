import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import {
  Retry,
  RetryOptions,
} from '../providers/retry';

export class RetryInterceptor implements NestInterceptor {
  private readonly retry: Retry;

  constructor() {
    let circuitBreakerOpts: RetryOptions = {
      maxRetries: 3,
      waitTime: 100,
      power: 2
    };

    this.retry = new Retry(circuitBreakerOpts);
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    return this.retry.exec(next);
  }
}
