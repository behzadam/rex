// @ts-ignore TS6133
import { expect, test } from '@jest/globals'
import { rex } from '../index'

const minFive = rex.number().min(5)
const maxFive = rex.number().max(5)
const positive = rex.number().positive()
const negative = rex.number().negative()

test('passing validations', () => {
  minFive.parse(5)
  minFive.parse(Infinity)
  maxFive.parse(5)
  maxFive.parse(-Infinity)
  positive.parse(1)
  positive.parse(Infinity)
  negative.parse(-1)
  negative.parse(-Infinity)
})

test('failing validations', () => {
  expect(() => maxFive.parse(6)).toThrow()
  expect(() => minFive.parse(4)).toThrow()
  expect(() => positive.parse(0)).toThrow()
  expect(() => positive.parse(-1)).toThrow()
  expect(() => negative.parse(0)).toThrow()
  expect(() => negative.parse(1)).toThrow()
})

/// number
const numberSchema = rex.number()
test('number async parse', async () => {
  const goodData = 1234.2353
  const badData = '1234'

  const goodResult = await numberSchema.safeParseAsync(goodData)
  expect(goodResult.success).toBe(true)
  if (goodResult.success) expect(goodResult.value).toEqual(goodData)

  const badResult = await numberSchema.safeParseAsync(badData)
  expect(badResult.success).toBe(false)
  if (!badResult.success)
    expect(badResult.error).toBe('Expected number, got string')
})
