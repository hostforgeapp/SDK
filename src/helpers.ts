/**
 * HostForge SDK Helpers
 *
 * Utility functions and classes for working with API responses
 */

import { ApiResponse } from './index';

/**
 * Custom error class for API errors
 */
export class HostForgeError extends Error {
  public code: number;
  public errors?: Record<string, string[]>;
  public response?: any;

  constructor(message: string, code: number = 500, errors?: Record<string, string[]>, response?: any) {
    super(message);
    this.name = 'HostForgeError';
    this.code = code;
    this.errors = errors;
    this.response = response;
  }

  /**
   * Check if this is a validation error (422)
   */
  isValidationError(): boolean {
    return this.code === 422;
  }

  /**
   * Check if this is an authentication error (401)
   */
  isAuthError(): boolean {
    return this.code === 401;
  }

  /**
   * Check if this is a forbidden error (403)
   */
  isForbiddenError(): boolean {
    return this.code === 403;
  }

  /**
   * Check if this is a not found error (404)
   */
  isNotFoundError(): boolean {
    return this.code === 404;
  }

  /**
   * Get validation errors as flat array
   */
  getValidationErrors(): string[] {
    if (!this.errors) return [];
    return Object.values(this.errors).flat();
  }

  /**
   * Get validation errors for a specific field
   */
  getFieldErrors(field: string): string[] {
    return this.errors?.[field] || [];
  }
}

/**
 * Result wrapper for API responses
 * Provides a clean interface for handling success/error cases
 */
export class Result<T> {
  private constructor(
    private readonly _success: boolean,
    private readonly _data?: T,
    private readonly _error?: HostForgeError
  ) {}

  /**
   * Create a successful result
   */
  static ok<T>(data: T): Result<T> {
    return new Result(true, data);
  }

  /**
   * Create a failed result
   */
  static fail<T>(error: HostForgeError): Result<T> {
    return new Result(false, undefined, error);
  }

  /**
   * Check if the result is successful
   */
  isSuccess(): boolean {
    return this._success;
  }

  /**
   * Check if the result is a failure
   */
  isFailure(): boolean {
    return !this._success;
  }

  /**
   * Get the data (throws if result is failure)
   */
  getData(): T {
    if (!this._success || !this._data) {
      throw new Error('Cannot get data from a failed result');
    }
    return this._data;
  }

  /**
   * Get the data or a default value
   */
  getDataOr(defaultValue: T): T {
    return this._success && this._data ? this._data : defaultValue;
  }

  /**
   * Get the data or null
   */
  getDataOrNull(): T | null {
    return this._success && this._data ? this._data : null;
  }

  /**
   * Get the error (throws if result is success)
   */
  getError(): HostForgeError {
    if (this._success || !this._error) {
      throw new Error('Cannot get error from a successful result');
    }
    return this._error;
  }

  /**
   * Get the error or null
   */
  getErrorOrNull(): HostForgeError | null {
    return !this._success && this._error ? this._error : null;
  }

  /**
   * Execute a function if the result is successful
   */
  onSuccess(fn: (data: T) => void): Result<T> {
    if (this._success && this._data) {
      fn(this._data);
    }
    return this;
  }

  /**
   * Execute a function if the result is a failure
   */
  onFailure(fn: (error: HostForgeError) => void): Result<T> {
    if (!this._success && this._error) {
      fn(this._error);
    }
    return this;
  }

  /**
   * Map the data to a new type
   */
  map<U>(fn: (data: T) => U): Result<U> {
    if (this._success && this._data) {
      return Result.ok(fn(this._data));
    }
    return Result.fail(this._error!);
  }

  /**
   * Chain another result-returning operation
   */
  flatMap<U>(fn: (data: T) => Result<U>): Result<U> {
    if (this._success && this._data) {
      return fn(this._data);
    }
    return Result.fail(this._error!);
  }
}

/**
 * Type guard to check if a response is successful
 */
export function isSuccessResponse<T>(response: ApiResponse<T>): response is ApiResponse<T> & { status: 'success'; data: T } {
  return response.status === 'success' && response.data !== undefined;
}

/**
 * Type guard to check if a response is an error
 */
export function isErrorResponse<T>(response: ApiResponse<T>): response is ApiResponse<T> & { status: 'error' } {
  return response.status === 'error';
}

/**
 * Extract data from API response or throw error
 */
export function unwrapResponse<T>(response: ApiResponse<T>): T {
  if (isSuccessResponse(response)) {
    return response.data;
  }
  throw new HostForgeError(
    response.message || 'API request failed',
    response.code,
    response.errors
  );
}

/**
 * Convert API response to Result
 */
export function toResult<T>(response: ApiResponse<T>): Result<T> {
  if (isSuccessResponse(response)) {
    return Result.ok(response.data);
  }
  return Result.fail(
    new HostForgeError(
      response.message || 'API request failed',
      response.code,
      response.errors,
      response
    )
  );
}

/**
 * Safe wrapper for async operations
 * Returns [error, null] on failure or [null, data] on success
 */
export async function safe<T>(
  promise: Promise<T>
): Promise<[null, T] | [HostForgeError, null]> {
  try {
    const data = await promise;
    return [null, data];
  } catch (error) {
    if (error instanceof HostForgeError) {
      return [error, null];
    }
    return [new HostForgeError(error instanceof Error ? error.message : 'Unknown error'), null];
  }
}

/**
 * Retry a function up to maxAttempts times
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');

      if (attempt < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
      }
    }
  }

  throw lastError!;
}

/**
 * Poll a function until it returns true or timeout is reached
 */
export async function poll<T>(
  fn: () => Promise<T>,
  checkFn: (result: T) => boolean,
  options: {
    intervalMs?: number;
    timeoutMs?: number;
    maxAttempts?: number;
  } = {}
): Promise<T> {
  const {
    intervalMs = 2000,
    timeoutMs = 60000,
    maxAttempts = 30
  } = options;

  const startTime = Date.now();
  let attempts = 0;

  while (true) {
    attempts++;

    const result = await fn();

    if (checkFn(result)) {
      return result;
    }

    if (attempts >= maxAttempts) {
      throw new Error(`Polling exceeded maximum attempts (${maxAttempts})`);
    }

    if (Date.now() - startTime >= timeoutMs) {
      throw new Error(`Polling timed out after ${timeoutMs}ms`);
    }

    await new Promise(resolve => setTimeout(resolve, intervalMs));
  }
}

/**
 * Batch process items with concurrency limit
 */
export async function batchProcess<T, R>(
  items: T[],
  processFn: (item: T) => Promise<R>,
  concurrency: number = 5
): Promise<R[]> {
  const results: R[] = [];
  const executing: Promise<void>[] = [];

  for (const item of items) {
    const promise = processFn(item).then(result => {
      results.push(result);
    });

    executing.push(promise);

    if (executing.length >= concurrency) {
      await Promise.race(executing);
      executing.splice(executing.findIndex(p => p === promise), 1);
    }
  }

  await Promise.all(executing);
  return results;
}

/**
 * Format currency amount
 */
export function formatCurrency(amount: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

/**
 * Format date
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('de-DE');
}

/**
 * Format date and time
 */
export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('de-DE');
}

/**
 * Check if a date is expired
 */
export function isExpired(dateString: string): boolean {
  return new Date(dateString) < new Date();
}

/**
 * Check if a date is expiring soon (within days)
 */
export function isExpiringSoon(dateString: string, days: number = 7): boolean {
  const expiryDate = new Date(dateString);
  const soonDate = new Date();
  soonDate.setDate(soonDate.getDate() + days);
  return expiryDate <= soonDate && expiryDate > new Date();
}

/**
 * Sleep for a specified duration
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate domain format
 */
export function isValidDomain(domain: string): boolean {
  const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-_]+\.)*[a-zA-Z0-9][a-zA-Z0-9-_]+\.[a-zA-Z]{2,11}?$/;
  return domainRegex.test(domain);
}
