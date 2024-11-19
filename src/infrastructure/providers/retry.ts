import { CallHandler } from '@nestjs/common';
import { catchError, map, mergeMap, retryWhen, throwError, timer } from 'rxjs';

export interface RetryOptions {
  maxRetries: number;
  waitTime: number; 
  power: number;
}

export class Retry {
  private readonly options: RetryOptions;

  constructor(options: RetryOptions) {
    this.options = options;
  }

  exec(next: CallHandler): any {
    return next.handle().pipe(
      map((data) => data),
      retryWhen((errors) =>
        errors.pipe(
          mergeMap((error, attempt) => {
            if (attempt >= this.options.maxRetries) {
              return throwError(() => new Error('Internal server error'));
            }
            console.log('ERROR')
            const delay = this.options.waitTime * this.options.power ** attempt;
            return timer(delay);
          }),
        )
      ),
      catchError((error) => {
        throw error;
      }),
    );
  }
}
