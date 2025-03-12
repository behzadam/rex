export type Result<T, E = string> =
  | { success: true; value: T }
  | { success: false; error: E }

export const Result = {
  valid: <T>(value: T): Result<T> => ({ success: true, value }),
  invalid: (error: string): Result<never> => ({ success: false, error }),
}
