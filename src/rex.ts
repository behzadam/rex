import { ParseReturnType } from './types'

export abstract class RexType<
  Output = any,
  Meta extends RexTypeMeta = RexTypeMeta,
  Input = Output,
> {
  //#region Properties
  // Store and infer type information at runtime.
  readonly _type!: Output
  readonly _output!: Output
  readonly _input!: Input
  readonly _meta!: Meta
  //#endregion

  constructor(meta: Meta) {
    this._meta = meta
    this.parse = this.parse.bind(this)
  }

  abstract _parse(input: unknown): ParseReturnType<Output>
  parse(input: Input): ParseReturnType<Output> {
    return this._parse(input)
  }

  get description() {
    return this._meta.description
  }
}

export interface RexTypeMeta {
  description?: string
}

export type RexRecord = { [k: string]: RexTypeAny }
export type RexTypeAny = RexType<any, any, any>
export type TypeOf<T extends RexType<any, any, any>> = T['_output']
export type input<T extends RexType<any, any, any>> = T['_input']
export type output<T extends RexType<any, any, any>> = T['_output']
export type { TypeOf as infer }
