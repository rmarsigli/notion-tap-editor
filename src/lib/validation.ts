/**
 * Validation utilities for user input
 */

const MAX_CAPTION_LENGTH = 500
const MAX_URL_LENGTH = 2048

/**
 * Sanitize text input by trimming and limiting length
 */
export function sanitizeText(text: string, maxLength: number = 1000): string {
  return text.trim().slice(0, maxLength)
}

/**
 * Validate and sanitize image caption
 */
export function validateCaption(caption: string): {
  isValid: boolean
  sanitized: string
  error?: string
} {
  const trimmed = caption.trim()

  if (trimmed.length > MAX_CAPTION_LENGTH) {
    return {
      isValid: false,
      sanitized: trimmed.slice(0, MAX_CAPTION_LENGTH),
      error: `Caption is too long. Maximum ${MAX_CAPTION_LENGTH} characters allowed.`,
    }
  }

  return {
    isValid: true,
    sanitized: trimmed,
  }
}

/**
 * Validate URL format
 */
export function validateUrl(url: string): boolean {
  if (!url || url.length > MAX_URL_LENGTH) {
    return false
  }

  try {
    const urlObj = new URL(url)
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * Sanitize HTML to prevent XSS (basic sanitization)
 */
export function sanitizeHtml(html: string): string {
  const div = document.createElement('div')
  div.textContent = html
  return div.innerHTML
}

/**
 * Check if string contains only allowed characters
 */
export function containsOnlyAllowedChars(
  str: string,
  allowedPattern: RegExp = /^[a-zA-Z0-9\s\-_.,!?'"()]+$/
): boolean {
  return allowedPattern.test(str)
}

/**
 * Validate file name
 */
export function validateFileName(fileName: string): {
  isValid: boolean
  error?: string
} {
  if (!fileName || fileName.trim().length === 0) {
    return {
      isValid: false,
      error: 'File name cannot be empty',
    }
  }

  if (fileName.length > 255) {
    return {
      isValid: false,
      error: 'File name is too long',
    }
  }

  // Check for dangerous characters
  // eslint-disable-next-line no-control-regex
  const dangerousChars = /[<>:"|?*\x00-\x1f]/
  if (dangerousChars.test(fileName)) {
    return {
      isValid: false,
      error: 'File name contains invalid characters',
    }
  }

  return {
    isValid: true,
  }
}

export const VALIDATION_LIMITS = {
  MAX_CAPTION_LENGTH,
  MAX_URL_LENGTH,
} as const
