import { Rex } from './rex.prototype'

describe('Rex', () => {
  describe('Schema Validation', () => {
    it('handles null values when schema is nullable', () => {
      const userSchema = Rex.object({
        name: Rex.string(),
        email: Rex.string(),
        age: Rex.number(),
        isActive: Rex.boolean(),
      }).nullable()

      const result = userSchema.safeParse(null)
      expect(result.success).toBe(true)
      expect(result.data).toBeNull()
      expect(result.error).toBeUndefined()
    })

    it('validates with missing optional fields', () => {
      const userSchema = Rex.object({
        name: Rex.string(),
        email: Rex.string().optional(),
        age: Rex.number().optional(),
        isActive: Rex.boolean(),
      })

      const result = userSchema.safeParse({
        name: 'Jane',
        isActive: false,
      })
      expect(result.success).toBe(true)
      expect(result.data).toEqual({
        name: 'Jane',
        isActive: false,
      })
    })

    it('fails validation for invalid types', () => {
      const userSchema = Rex.object({
        name: Rex.string(),
        age: Rex.number(),
      })

      const result = userSchema.safeParse({
        name: 123,
        age: 'invalid',
      })
      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })

    it('validates nested objects', () => {
      const addressSchema = Rex.object({
        street: Rex.string(),
        city: Rex.string(),
        country: Rex.string(),
      })

      const userSchema = Rex.object({
        name: Rex.string(),
        address: addressSchema,
      })

      const result = userSchema.safeParse({
        name: 'Alice',
        address: {
          street: 'Main St',
          city: 'Boston',
          country: 'USA',
        },
      })
      expect(result.success).toBe(true)
      expect(result.data.address.city).toBe('Boston')
    })
  })
})
