import { rex } from '../index'
test('string infer', () => {
  const s = rex.string()
  type sType = rex.infer<typeof s>
})
