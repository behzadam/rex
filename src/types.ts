export type Primitive =
  | string
  | number
  | symbol
  | bigint
  | boolean
  | null
  | undefined

export type Scalars = Primitive | Primitive[]

export type AnyObject = Record<string, any>
export interface ParseResult {
  status: 'aborted' | 'dirty' | 'valid'
  data: any
}

export type INVALID = { status: 'aborted' }
export const INVALID: INVALID = Object.freeze({
  status: 'aborted',
})

export type DIRTY<T> = { status: 'dirty'; value: T }
export const DIRTY = <T>(value: T): DIRTY<T> => ({ status: 'dirty', value })

export type OK<T> = { status: 'valid'; value: T }
export const OK = <T>(value: T): OK<T> => ({ status: 'valid', value })

export type SyncParseReturnType<T = any> = OK<T> | DIRTY<T> | INVALID
export type AsyncParseReturnType<T> = Promise<SyncParseReturnType<T>>
export type ParseReturnType<T> =
  | SyncParseReturnType<T>
  | AsyncParseReturnType<T>
