import { zodResolver } from '@hookform/resolvers/zod';
import { useForm as useReactHookForm } from 'react-hook-form';

// Re-export useForm and zodResolver for convenience
export { useReactHookForm as useForm, zodResolver };

/**
 * Helper to extract error message from form state
 *
 * @example
 * <input {...register('email')} />
 * {errors.email && <span>{getErrorMessage(errors.email)}</span>}
 */
export function getErrorMessage(error: { message?: string }): string {
  return error?.message || 'This field is required';
}

/**
 * Helper to check if field has error
 */
export function hasError(errors: Record<string, unknown>, fieldName: string): boolean {
  return !!errors[fieldName];
}
