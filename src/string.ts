import { RexType } from './rex-type'
import { errorUtil } from './utils'

export type StringCheck =
  | { kind: 'min'; value: number; message?: string }
  | { kind: 'max'; value: number; message?: string }

class RexString extends RexType<string, StringCheck> {
  parse(input: unknown): string {
    if (typeof input !== 'string') {
      throw new Error(`Expected string, got ${typeof input}`)
    }

    for (const validate of this._checks) {
      if (validate.kind === 'min' && input.length < validate.value) {
        throw new Error(
          validate.message ??
            `String must be at least ${validate.value} characters long`,
        )
      }

      if (validate.kind === 'max' && input.length > validate.value) {
        throw new Error(
          validate.message ??
            `String must be at most ${validate.value} characters long`,
        )
      }
    }

    return input
  }

  min(minLength: number, message?: errorUtil.ErrMessage) {
    return this._check({
      kind: 'min',
      value: minLength,
      ...errorUtil.errToObj(message),
    })
  }

  max(maxLength: number, message?: errorUtil.ErrMessage) {
    return this._check({
      kind: 'max',
      value: maxLength,
      ...errorUtil.errToObj(message),
    })
  }

  static create(): RexString {
    return new RexString()
  }
}

export const string = RexString.create
