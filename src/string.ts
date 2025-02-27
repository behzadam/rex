import { RexType } from './rex-type'
import { errorUtil } from './utils'

export type StringValidation =
  | { kind: 'min'; value: number; message?: string }
  | { kind: 'max'; value: number; message?: string }

class RexString extends RexType<string, StringValidation> {
  parse(input: unknown): string {
    if (typeof input !== 'string') {
      throw new Error(`Expected string, got ${typeof input}`)
    }

    for (const validate of this._validations) {
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
    return this._addValidate({
      kind: 'min',
      value: minLength,
      ...errorUtil.errToObj(message),
    })
  }

  max(maxLength: number, message?: errorUtil.ErrMessage) {
    return this._addValidate({
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
