import { ParseReturnType } from './types'

export abstract class RexType<
  Output = any,
  Def extends RexTypeDef = RexTypeDef,
  Input = Output,
> {
  //#region Properties
  // Store and infer type information at runtime.
  readonly _type!: Output
  readonly _output!: Output
  readonly _input!: Input
  readonly _def!: Def
  //#endregion

  constructor(def: Def) {
    this._def = def
  }

  protected _checks: Output[] = []
  protected _check(check: Output) {
    this._checks.push(check)
    return this
  }

  abstract _parse(input: unknown): ParseReturnType<Output>

  get description() {
    return this._def.description
  }
}
export interface RexTypeDef {
  description?: string
}
export type RexRecord = { [k: string]: RexTypeAny }
export type RexTypeAny = RexType<any, any, any>
export type TypeOf<T extends RexType<any, any, any>> = T['_output']
export type input<T extends RexType<any, any, any>> = T['_input']
export type output<T extends RexType<any, any, any>> = T['_output']
export type { TypeOf as infer }
