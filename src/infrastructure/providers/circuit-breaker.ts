import { CallHandler } from '@nestjs/common';
import { catchError, map } from 'rxjs';

export interface CircuitBreakerOptions {
  successThreshold: number;
  failureThreshold: number;
  halfOpenAttemptsThreshold: number;
  openStateTime: number;
}

export class CircuitBreaker {
  private readonly CIRCUIT_STATES = {
    OPEN: 'OPEN',
    CLOSE: 'CLOSE',
    HALFOPEN: 'HALFOPEN',
  };
  private currentState: string = this.CIRCUIT_STATES.CLOSE;
  private failureCount: number = 0;
  private successCount: number = 0;
  private nextAttempt: number;
  private halfOpenAttemptsCount: number = 0;
  private readonly options: CircuitBreakerOptions;

  constructor(options: CircuitBreakerOptions) {
    this.options = {
      successThreshold: options?.successThreshold
        ? options.successThreshold
        : 3,
      failureThreshold: options?.failureThreshold
        ? options.failureThreshold
        : 3,
      halfOpenAttemptsThreshold: options?.halfOpenAttemptsThreshold
        ? options.halfOpenAttemptsThreshold
        : 3,
      openStateTime: options?.openStateTime ? options.openStateTime : 500,
    };
  }

  exec(next: CallHandler): any {
    if (this.currentState == this.CIRCUIT_STATES.OPEN) {
      return this.handleOpened(next);
    } else if (this.currentState == this.CIRCUIT_STATES.HALFOPEN) {
      return this.handleHalfOpen(next);
    }

    return this.handleClosed(next);
  }

  /*
        THE LOGIC OF THE CLOSED STATE IS COMPLETE. THIS WILL EXECUTE THE REQUEST
        IF WAS SUCCESS ONLY SUM ONE MORE ON SUCCESS COUNTER 
        IF NOT SUM ONE MORE ON FAILURE COUNTER AND CHECK IF REACH THE FAILURE THRESHOLD TO TRANSFER STATE TO OPENED
    */
  private handleClosed(next: CallHandler): any {
    console.log('Executing the request...');

    return next.handle().pipe(
      map((data) => {
        console.log(data);
        this.successCount++;
        return data;
      }),
      catchError((err) => {
        this.registerFailure();
        console.log('receive an error from request.');
        if (this.failureCount >= this.options.failureThreshold) {
          console.log('Transferring the Circuit to Open state!');

          this.transferState('open'.toUpperCase());
        }
        throw new Error('Internal server error');
      }),
    );
  }

  /*
        THE LOGIC OF THE OPENED STATE IS COMPLETE.
        THIS WILL CHECK IF THE NEXT ATTEMPT IS LOWER THE CURRENT TIMESTAMP
        IF IS LOWER WILL TRANSFER THE STATE TO HALFOPEN STATE
        IF NOT WILL ONLY NOTIFY THE CLIENT THAT THE SERVICE IS DOWN
    */
  private handleOpened(next: CallHandler): any {
    if (this.nextAttempt < Date.now()) {
      console.log('Transferring the Circuit to HalfOpen state!');
      this.transferState('halfopen'.toUpperCase());
      this.handleHalfOpen(next);
    }
    console.log('Circuit is on Open state! Wait some time to trying again.');
    throw new Error('Service unavailable. Please Try again later');
  }

  // THE LOGIC OF THE HALFOPEN STATE IS COMPLETE.
  private handleHalfOpen(next: CallHandler): any {
    console.log('Circuit is on Half Open state! Executing the request...');
    this.halfOpenAttemptsCount++;
    return next.handle().pipe(
      map((data) => {
        this.successCount++;
        if (this.successCount >= this.options.successThreshold) {
          console.log('Transferring the Circuit to Close state!');
          this.transferState('close'.toUpperCase());
          this.halfOpenAttemptsCount = 0;
        }
        return data;
      }),
      catchError((err) => {
        this.registerFailure();
        console.log('receive an error from request.');
        this.halfOpenAttemptsCount = 0;
        console.log('Transferring the Circuit to Open state!');

        this.transferState('open'.toUpperCase());
        throw new Error('Internal server error');
      }),
    );
  }

  /*
        THE LOGIC OF THE REGISTER OF A NEW FAILURE.
    */
  private registerFailure() {
    this.failureCount++;
  }

  /*
        THE LOGIC OF THE TRANSFER STATE METHOD IS COMPLETE. 
        THIS WILL RESTARTS THE COUNTERS AND ASSOCIATE THE CURRENT STATE TO NEW STATE.
    */
  private transferState(state: string) {
    this.successCount = 0;
    this.failureCount = 0;
    this.halfOpenAttemptsCount = 0;
    this.currentState = this.CIRCUIT_STATES[state];
    if (state == 'OPEN') {
      this.nextAttempt = Date.now() + this.options.openStateTime;
    }
  }
}
