import { RexType, RexTypeDef } from './rex'
import { OK } from './types'

export type StringCheck =
  | { kind: 'min'; value: number; message?: string }
  | { kind: 'max'; value: number; message?: string }

class RexString extends RexType<string, RexTypeDef, string> {
  constructor() {
    super({
      description: 'string',
    })
  }

  _parse(input: unknown) {
    if (typeof input !== 'string') {
      throw new Error(`Expected string, got ${typeof input}`)
    }

    return OK(input)
  }
  // check(check: StringCheck) {
  //   switch (check.kind) {
  //     case 'min':
  //       if (this._output.length < check.value) {
  //         throw new Error(
  //           check.message || `Expected at least ${check.value} characters`,
  //         )
  //       }
  //       break
  //     case 'max':
  //       if (this._output.length > check.value) {
  //         throw new Error(
  //           check.message || `Expected at most ${check.value} characters`,
  //         )
  //       }
  //       break
  //   }
  //   return this
  // }

  static create(): RexString {
    return new RexString()
  }
}

export const string = RexString.create
