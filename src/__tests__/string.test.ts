import { rex } from '../index'

describe('string', () => {
  it('accepts valid strings', () => {
    const r = rex.string()
    expect(r.parse('Hi')).toBe('Hi')
  })

  it('rejects non-string values', () => {
    const r = rex.string()
    expect(() => r.parse(1)).toThrow()
  })

  it('accepts strings with min length', () => {
    const r = rex.string().min(3)
    expect(r.parse('Hello')).toBe('Hello')
  })

  it('rejects strings with min length', () => {
    const r = rex.string().min(3)
    expect(() => r.parse('Hi')).toThrow()
  })

  it('accepts strings with max length', () => {
    const r = rex.string().max(5)
    expect(r.parse('Hello')).toBe('Hello')
  })

  it('rejects strings with max length', () => {
    const r = rex.string().max(3)
    expect(() => r.parse('Hello')).toThrow()
  })
})
