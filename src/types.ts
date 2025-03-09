export type Result<T> =
  | { status: 'valid'; value: T }
  | { status: 'invalid'; message: string }

export const Result = {
  valid: <T>(value: T): Result<T> => ({ status: 'valid', value }),
  invalid: (message: string): Result<never> => ({ status: 'invalid', message }),
}
