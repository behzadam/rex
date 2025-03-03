import { RexType, RexTypeMeta } from './rex'
import { OK } from './types'

export type StringValidation =
  | { kind: 'min'; value: number; message?: string }
  | { kind: 'max'; value: number; message?: string }

export interface StringMeta extends RexTypeMeta {
  validations: StringValidation[]
}

class RexString extends RexType<string, StringMeta, string> {
  _parse(input: unknown) {
    if (typeof input !== 'string') {
      throw new Error(`Expected string, got ${typeof input}`)
    }

    for (const validation of this._meta.validations) {
      if (validation.kind === 'min') {
        min(input, validation)
      }
      if (validation.kind === 'max') {
        max(input, validation)
      }
    }

    return OK(input)
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

const min = (input: string, validation: StringValidation) => {
  if (input.length < validation.value) {
    throw new Error(
      validation.message ||
        `Expected string to be at least ${validation.value} characters long`,
    )
  }
}

const max = (input: string, validation: StringValidation) => {
  if (input.length > validation.value) {
    throw new Error(
      validation.message ||
        `Expected string to be at most ${validation.value} characters long`,
    )
  }
}

export const string = RexString.create
