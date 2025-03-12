import { RexType, RexTypeMeta } from './rex'
import { Result } from './types'

export type StringValidation =
  | { kind: 'min'; value: number; message?: string }
  | { kind: 'max'; value: number; message?: string }

export interface StringMeta extends RexTypeMeta {
  validations: StringValidation[]
}

class RexString extends RexType<string, StringMeta, string> {
  _parse(input: unknown) {
    if (typeof input !== 'string') {
      return Result.invalid(`Expected string, got ${typeof input}`)
    }

    for (const validation of this._meta.validations) {
      if (validation.kind === 'min') {
        if (input.length < validation.value) {
          const message =
            validation.message ||
            `Expected string to be at least ${validation.value} characters long`
          return Result.invalid(message)
        }
      }
      if (validation.kind === 'max') {
        if (input.length > validation.value) {
          const message =
            validation.message ||
            `Expected string to be at most ${validation.value} characters long`
          return Result.invalid(message)
        }
      }
    }

    return Result.valid(input)
  }

  _addValidation(validation: StringValidation) {
    this._meta.validations.push(validation)
    return this
  }

  min(value: number, message?: string) {
    return this._addValidation({ kind: 'min', value, message })
  }

  max(value: number, message?: string) {
    return this._addValidation({ kind: 'max', value, message })
  }

  static create = (): RexString => {
    return new RexString({
      description: 'A string',
      validations: [],
    })
  }
}

export const string = RexString.create
