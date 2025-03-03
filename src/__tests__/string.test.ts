import { rex } from '../index'

const minFive = rex.string().min(5, 'min5')
const maxFive = rex.string().max(5, 'max5')

test('passing validations', () => {
  minFive.parse('12345')
  minFive.parse('123456')
  maxFive.parse('12345')
  maxFive.parse('1234')
})

test('failing validations', () => {
  expect(() => minFive.parse('1234')).toThrow()
  expect(() => maxFive.parse('123456')).toThrow()
})
