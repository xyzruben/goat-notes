/**
 * Input Sanitization Utilities
 *
 * These functions help prevent various types of attacks including:
 * - XSS (Cross-Site Scripting)
 * - Prompt Injection
 * - SQL Injection (though Prisma handles this)
 */

/**
 * Sanitizes text input by removing potentially dangerous content
 * Used before storing user input or sending to AI models
 */
export function sanitizeTextInput(text: string): string {
  if (!text) return "";

  // Remove script tags and their content
  let sanitized = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Remove event handlers (onclick, onerror, etc.)
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');

  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, '');

  // Remove data: protocol (can be used for XSS)
  sanitized = sanitized.replace(/data:text\/html/gi, '');

  // Trim whitespace
  sanitized = sanitized.trim();

  return sanitized;
}

/**
 * Validates note text length and content
 * Returns null if valid, error message if invalid
 */
export function validateNoteText(text: string): string | null {
  if (!text) return null; // Empty notes are allowed

  // Maximum length: 50,000 characters
  if (text.length > 50000) {
    return "Note exceeds maximum length of 50,000 characters";
  }

  // Minimum length: no restriction on minimum
  // (users should be able to save empty notes)

  return null; // Valid
}

/**
 * Sanitizes text specifically for AI prompt injection prevention
 * Removes delimiter closing tags and common prompt injection patterns
 */
export function sanitizeForAI(text: string): string {
  if (!text) return "";

  let sanitized = text;

  // Remove closing delimiter tags that could break out of prompt context
  sanitized = sanitized.replace(/<\/note>/gi, '[REDACTED]');
  sanitized = sanitized.replace(/<\/system>/gi, '[REDACTED]');
  sanitized = sanitized.replace(/<\/prompt>/gi, '[REDACTED]');

  // Replace common prompt injection patterns with safe text
  // Note: This is a basic defense. The main defense is in the system prompt itself
  const injectionPatterns = [
    /ignore\s+previous\s+instructions/gi,
    /ignore\s+all\s+previous\s+instructions/gi,
    /disregard\s+previous\s+instructions/gi,
    /forget\s+previous\s+instructions/gi,
    /system:\s*/gi,
  ];

  injectionPatterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '[FILTERED]');
  });

  return sanitized;
}

/**
 * Escapes HTML special characters to prevent XSS
 * Use this when displaying user content in HTML
 */
export function escapeHtml(text: string): string {
  if (!text) return "";

  const htmlEscapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  return text.replace(/[&<>"'/]/g, (char) => htmlEscapeMap[char]);
}
