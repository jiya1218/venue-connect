/**
 * Basic server-side HTML sanitizer for SEO content.
 * Strips dangerous tags (script, iframe, object, embed, form) and event handlers.
 * For full protection, consider using DOMPurify with jsdom in a server context.
 */
export function sanitizeHTML(html: string): string {
  if (!html) return '';

  return html
    // Remove script tags and their content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove iframe, object, embed, form tags
    .replace(/<\s*\/?\s*(iframe|object|embed|form|link|style)\b[^>]*>/gi, '')
    // Remove event handlers (onclick, onerror, onload, etc.)
    .replace(/\s+on\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    // Remove javascript: URLs
    .replace(/href\s*=\s*["']?\s*javascript:/gi, 'href="')
    // Remove data: URLs in src attributes
    .replace(/src\s*=\s*["']?\s*data:/gi, 'src="');
}
