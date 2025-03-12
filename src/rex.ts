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

  /**
   * Parses the given input and returns the parse result.
   * This method is abstract and must be implemented by subclasses.
   *
   * @param input - The input to be parsed.
   * @returns The parse result.
   */
  abstract _parse(input: unknown): ParseReturnType<Output>

  /**
   * Safely parses the given input and returns the parse result.
   * If the parse result is asynchronous, it throws an error.
   *
   * @param input - The input to be parsed.
   * @returns The parse result.
   */
  safeParse(input: unknown): ParseReturnType<Output> {
    const result = this._parse(input)
    if (isAsync(result)) {
      throw new Error('Synchronous parse encountered promise.')
    }
    return result
  }

  /**
   * Parses the given input and returns the parsed output.
   * If the parse is successful, the parsed value is returned.
   * If the parse fails, the error is thrown.
   *
   * @param input - The input to be parsed.
   * @returns The parsed output.
   * @throws {Error} If the parse result is asynchronous.
   */
  parse(input: unknown): Output {
    const result = this.safeParse(input) as SyncParseReturnType<Output>
    if (result.success) {
      return result.value
    }
    throw result.error
  }

  /**
   * Safely parses the given input asynchronously and returns the parse result.
   * If the parse result is synchronous, it is wrapped in a Promise.
   *
   * @param input - The input to be parsed.
   * @returns The parse result, which may be synchronous or asynchronous.
   */
  async safeParseAsync(input: unknown): Promise<ParseReturnType<Output>> {
    const resultSyncOrAsync = await this._parse(input)
    if (isAsync(resultSyncOrAsync)) {
      return resultSyncOrAsync
    }
    return Promise.resolve(resultSyncOrAsync)
  }

  /**
   * Parses the given input asynchronously and returns the parsed output.
   * If the parse is successful, the parsed value is returned.
   * If the parse fails, the error is thrown.
   *
   * @param input - The input to be parsed.
   * @returns The parsed output.
   * @throws {Error} If the parse result is not successful.
   */
  async parseAsync(input: unknown): Promise<Output> {
    const result = await this.safeParseAsync(input)
    if (result.success) {
      return result.value
    }
    throw result.error
  }

  /**
   * Gets the description of the RexTypeMeta.
   * @returns The description of the RexTypeMeta.
   */
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

export const isAsync = <T>(
  x: ParseReturnType<T>,
): x is AsyncParseReturnType<T> =>
  typeof Promise !== 'undefined' && x instanceof Promise
