/**
 * Error handling utilities
 * Provides safe error messages without exposing sensitive information
 */

export class SafeError extends Error {
  constructor(
    public readonly userMessage: string,
    public readonly code: string = 'UNKNOWN_ERROR'
  ) {
    super(userMessage);
    this.name = 'SafeError';
  }
}

/**
 * Extract safe error message for client display
 */
export function getSafeErrorMessage(error: unknown): string {
  if (error instanceof SafeError) {
    return error.userMessage;
  }

  if (error instanceof Error) {
    // Log full error server-side but return generic message to client
    console.error('[SafeError]', error.message);
    return 'An error occurred. Please try again.';
  }

  return 'An unexpected error occurred.';
}

/**
 * Log errors safely without exposing sensitive information
 */
export function logError(
  component: string,
  error: unknown,
  context?: Record<string, unknown>
): void {
  const timestamp = new Date().toISOString();

  if (error instanceof SafeError) {
    console.error(`[${timestamp}] [${component}] ${error.userMessage}`, context);
  } else if (error instanceof Error) {
    console.error(`[${timestamp}] [${component}] ${error.message}`, context);
  } else {
    console.error(`[${timestamp}] [${component}] Unknown error`, { error, context });
  }
}

/**
 * Validation error for form inputs
 */
export class ValidationError extends SafeError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR');
  }
}

/**
 * Authentication error
 */
export class AuthError extends SafeError {
  constructor(message: string = 'Authentication failed') {
    super(message, 'AUTH_ERROR');
  }
}

/**
 * Payment error
 */
export class PaymentError extends SafeError {
  constructor(message: string = 'Payment processing failed') {
    super(message, 'PAYMENT_ERROR');
  }
}
