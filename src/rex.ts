import { Result } from './types'

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
    this.safeParse = this.safeParse.bind(this)
    this.parseAsync = this.parseAsync.bind(this)
    this.safeParseAsync = this.safeParseAsync.bind(this)
  }

  abstract _parse(input: unknown): ParseReturnType<Output>

  parse(input: unknown): Output {
    const result = this.safeParse(input) as SyncParseReturnType<Output>
    if (result.status === 'valid') {
      return result.value
    }
    throw new Error(result.message)
  }

  safeParse(input: unknown): ParseReturnType<Output> {
    try {
      return this._parse(input)
    } catch (error) {
      return Result.invalid(
        error instanceof Error ? error.message : 'Invalid input',
      )
    }
  }

  async safeParseAsync(input: unknown): Promise<ParseReturnType<Output>> {
    try {
      return await Promise.resolve(this._parse(input))
    } catch (error) {
      return Result.invalid(
        error instanceof Error ? error.message : 'Invalid input',
      )
    }
  }

  async parseAsync(input: unknown): Promise<Output> {
    const result = await Promise.resolve(this.safeParse(input))
    if (result.status === 'valid') {
      return result.value
    }
    throw new Error(result.message)
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

export type SyncParseReturnType<T = any> = Result<T>
export type AsyncParseReturnType<T> = Promise<Result<T>>
export type ParseReturnType<T> =
  | SyncParseReturnType<T>
  | AsyncParseReturnType<T>
