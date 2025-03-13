import { RexType, RexTypeMeta } from './rex'
import { Result } from './types'

export type NumberValidation =
  | { kind: 'min'; value: number; inclusive: boolean; message?: string }
  | { kind: 'max'; value: number; inclusive: boolean; message?: string }

export interface NumberMeta extends RexTypeMeta {
  validations: NumberValidation[]
}

export class RexNumber extends RexType<number, NumberMeta, number> {
  _parse(input: unknown) {
    if (typeof input !== 'number') {
      return Result.invalid(`Expected number, got ${typeof input}`)
    }
    for (const validation of this._meta.validations) {
      const result = this._check(input, validation)
      if (!result.success) return result
    }
    return Result.valid(input)
  }

  private _check(input: number, validation: NumberValidation): Result<number> {
    const { kind, value, message, inclusive } = validation
    if (kind === 'min') {
      const tooSmall = inclusive ? input < value : input <= value
      if (tooSmall) {
        return Result.invalid(
          message || `Expected number to be at least ${value}`,
        )
      }
    }
    if (kind === 'max') {
      const tooBig = inclusive ? input > value : input >= value
      if (tooBig) {
        return Result.invalid(
          message || `Expected number to be at most ${value}`,
        )
      }
    }
    return Result.valid(input)
  }

  private _addValidation(validation: NumberValidation) {
    this._meta.validations.push(validation)
    return this
  }

  min(value: number, message?: string) {
    return this._addValidation({
      kind: 'min',
      value,
      message,
      inclusive: true,
    })
  }

  max(value: number, message?: string) {
    return this._addValidation({
      kind: 'max',
      value,
      message,
      inclusive: true,
    })
  }

  positive(message?: string) {
    return this._addValidation({
      kind: 'min',
      value: 0,
      message,
      inclusive: false,
    })
  }

  negative(message?: string) {
    return this._addValidation({
      kind: 'max',
      value: 0,
      message,
      inclusive: false,
    })
  }

  static create() {
    return new RexNumber({
      validations: [],
      description: 'number',
    })
  }
}

export const number = RexNumber.create
