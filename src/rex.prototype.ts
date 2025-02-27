import { Result } from './types'

export class Rex<T> {
  private validators: ((value: T) => Result)[] = []

  constructor(private type: string) {}

  pipe<U extends T>(schema: Rex<U>): Rex<U> {
    const newSchema = new Rex<U>(schema.type)
    newSchema.validators = [
      ...(this.validators as ((value: U) => Result)[]),
      ...schema.validators,
    ]
    return newSchema
  }

  optional(): Rex<T | undefined> {
    const schema = new Rex<T | undefined>(this.type)
    schema.validators.push(value => {
      if (value === undefined) return { success: true }
      return this.validate(value as T)
    })
    return schema
  }

  nullable(): Rex<T | null> {
    const schema = new Rex<T | null>(this.type)
    schema.validators.push(value => {
      if (value === null) return { success: true }
      return this.validate(value as T)
    })
    return schema
  }

  parse(value: unknown): T {
    const result = this.validate(value as T)
    if (!result.success) {
      throw new Error(result.errors?.join(', '))
    }
    return value as T
  }

  safeParse(value: unknown): { success: boolean; data?: T; error?: Error } {
    const result = this.validate(value as T)
    if (!result.success) {
      return {
        success: false,
        error: new Error(result.errors?.join(', ')),
      }
    }
    return { success: true, data: value as T }
  }

  validate(value: T): Result {
    const errors: string[] = []
    for (const validator of this.validators) {
      const result = validator(value)
      if (!result.success) {
        errors.push(...(result.errors || []))
      }
    }
    return errors.length === 0 ? { success: true } : { success: false, errors }
  }

  add(validator: (value: T) => Result): void {
    this.validators.push(validator)
  }

  static string(): Rex<string> {
    const schema = new Rex<string>('string')
    schema.add(value => {
      if (typeof value !== 'string') {
        return {
          success: false,
          errors: [`Expected string, got ${typeof value}`],
        }
      }
      return { success: true }
    })
    return schema
  }

  static number(): Rex<number> {
    const schema = new Rex<number>('number')
    schema.add(value => {
      if (typeof value !== 'number') {
        return {
          success: false,
          errors: [`Expected number, got ${typeof value}`],
        }
      }
      return { success: true }
    })
    return schema
  }

  static boolean(): Rex<boolean> {
    const schema = new Rex<boolean>('boolean')
    schema.add(value => {
      if (typeof value !== 'boolean') {
        return {
          success: false,
          errors: [`Expected boolean, got ${typeof value}`],
        }
      }
      return { success: true }
    })
    return schema
  }

  static object<T>(shape: { [K in keyof T]: Rex<T[K]> }): Rex<T> {
    const schema = new Rex<T>('object')
    schema.add(value => {
      if (typeof value !== 'object' || value === null) {
        return {
          success: false,
          errors: [`Expected object, got ${typeof value}`],
        }
      }
      const errors: string[] = []
      for (const key in shape) {
        if (shape.hasOwnProperty(key)) {
          const result = shape[key].validate((value as any)[key])
          if (!result.success) {
            errors.push(...(result.errors || []))
          }
        }
      }
      return errors.length === 0
        ? { success: true }
        : { success: false, errors }
    })
    return schema
  }
}
