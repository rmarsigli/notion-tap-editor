import { describe, it, expect } from 'vitest'
import {
  sanitizeText,
  validateCaption,
  validateUrl,
  validateFileName,
  containsOnlyAllowedChars,
  VALIDATION_LIMITS,
} from '@/lib/validation'

describe('Validation Utilities', () => {
  describe('sanitizeText', () => {
    it('should trim whitespace', () => {
      expect(sanitizeText('  hello  ')).toBe('hello')
    })

    it('should limit length to default 1000 chars', () => {
      const longText = 'a'.repeat(1500)
      expect(sanitizeText(longText)).toHaveLength(1000)
    })

    it('should limit length to custom max', () => {
      const text = 'a'.repeat(100)
      expect(sanitizeText(text, 50)).toHaveLength(50)
    })

    it('should handle empty string', () => {
      expect(sanitizeText('')).toBe('')
    })
  })

  describe('validateCaption', () => {
    it('should validate normal caption', () => {
      const result = validateCaption('A nice photo')
      expect(result.isValid).toBe(true)
      expect(result.sanitized).toBe('A nice photo')
      expect(result.error).toBeUndefined()
    })

    it('should trim whitespace', () => {
      const result = validateCaption('  caption  ')
      expect(result.sanitized).toBe('caption')
    })

    it('should reject caption over max length', () => {
      const longCaption = 'a'.repeat(VALIDATION_LIMITS.MAX_CAPTION_LENGTH + 1)
      const result = validateCaption(longCaption)
      expect(result.isValid).toBe(false)
      expect(result.error).toBeDefined()
      expect(result.sanitized).toHaveLength(VALIDATION_LIMITS.MAX_CAPTION_LENGTH)
    })

    it('should accept caption at max length', () => {
      const maxCaption = 'a'.repeat(VALIDATION_LIMITS.MAX_CAPTION_LENGTH)
      const result = validateCaption(maxCaption)
      expect(result.isValid).toBe(true)
    })
  })

  describe('validateUrl', () => {
    it('should validate http URL', () => {
      expect(validateUrl('http://example.com')).toBe(true)
    })

    it('should validate https URL', () => {
      expect(validateUrl('https://example.com')).toBe(true)
    })

    it('should reject invalid URL', () => {
      expect(validateUrl('not a url')).toBe(false)
    })

    it('should reject ftp protocol', () => {
      expect(validateUrl('ftp://example.com')).toBe(false)
    })

    it('should reject empty URL', () => {
      expect(validateUrl('')).toBe(false)
    })

    it('should reject too long URL', () => {
      const longUrl = 'https://example.com/' + 'a'.repeat(VALIDATION_LIMITS.MAX_URL_LENGTH)
      expect(validateUrl(longUrl)).toBe(false)
    })
  })

  describe('validateFileName', () => {
    it('should validate normal filename', () => {
      const result = validateFileName('image.jpg')
      expect(result.isValid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should validate filename with spaces', () => {
      const result = validateFileName('my image.jpg')
      expect(result.isValid).toBe(true)
    })

    it('should reject empty filename', () => {
      const result = validateFileName('')
      expect(result.isValid).toBe(false)
      expect(result.error).toBeDefined()
    })

    it('should reject too long filename', () => {
      const longName = 'a'.repeat(300) + '.jpg'
      const result = validateFileName(longName)
      expect(result.isValid).toBe(false)
    })

    it('should reject dangerous characters', () => {
      const dangerousNames = ['<script>.jpg', 'file|name.jpg', 'file?.jpg']
      dangerousNames.forEach((name) => {
        const result = validateFileName(name)
        expect(result.isValid).toBe(false)
      })
    })
  })

  describe('containsOnlyAllowedChars', () => {
    it('should accept alphanumeric and common punctuation', () => {
      expect(containsOnlyAllowedChars('Hello World 123!')).toBe(true)
    })

    it('should reject special characters', () => {
      expect(containsOnlyAllowedChars('Hello <script>')).toBe(false)
    })

    it('should accept custom pattern', () => {
      const onlyDigits = /^\d+$/
      expect(containsOnlyAllowedChars('123', onlyDigits)).toBe(true)
      expect(containsOnlyAllowedChars('abc', onlyDigits)).toBe(false)
    })
  })
})
