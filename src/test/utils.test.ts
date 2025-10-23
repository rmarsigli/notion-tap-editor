import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils'

describe('Utils', () => {
  describe('cn function', () => {
    it('should merge class names', () => {
      const result = cn('class1', 'class2')
      expect(result).toBeTruthy()
      expect(typeof result).toBe('string')
    })

    it('should handle empty inputs', () => {
      const result = cn()
      expect(result).toBe('')
    })

    it('should handle undefined and null', () => {
      const result = cn('class1', undefined, null, 'class2')
      expect(result).toBeTruthy()
    })

    it('should handle conditional classes', () => {
      const isActive = true
      const result = cn('base', isActive && 'active')
      expect(result).toContain('base')
    })

    it('should merge tailwind classes properly', () => {
      const result = cn('px-2 py-1', 'px-4')
      expect(result).toBeTruthy()
      // tailwind-merge should keep only px-4
      expect(result).toContain('px-4')
      expect(result).not.toContain('px-2')
    })
  })
})
