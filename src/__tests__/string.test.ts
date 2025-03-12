import { rex } from '../index'

const minFive = rex.string().min(5, 'min5')
const maxFive = rex.string().max(5, 'max5')
const stringSchema = rex.string()

test('passing validations', () => {
  minFive.parse('12345')
  minFive.parse('123456')
  maxFive.parse('12345')
  maxFive.parse('1234')
})

test('failing validations', () => {
  expect(() => minFive.parse('1234')).toThrow()
  expect(() => maxFive.parse('123456')).toThrow()
  expect(() => minFive.parse('1234')).toThrow('min5')
  expect(() => maxFive.parse('123456')).toThrow('max5')
})

test('string async parse', async () => {
  const goodData = 'XXX'
  const badData = 12

  const goodResult = await stringSchema.safeParseAsync(goodData)
  expect(goodResult.success).toBe(true)
  if (goodResult.success) expect(goodResult.value).toEqual(goodData)

  const badResult = await stringSchema.safeParseAsync(badData)
  expect(badResult.success).toBe(false)
  if (!badResult.success) {
    expect(badResult.error).toBe('Expected string, got number')
  }
})
