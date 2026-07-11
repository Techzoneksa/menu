/**
 * Normalize search text for Arabic and English
 * - trim whitespace
 * - lowercase English
 * - normalize Arabic diacritics (tashkeel)
 * - normalize Arabic alef variants
 * - collapse multiple spaces
 */
export function normalizeSearchText(text: string): string {
  return text
    .trim()
    .toLowerCase()
    // Remove Arabic diacritics (tashkeel)
    .replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED]/g, '')
    // Normalize Arabic alef variants to bare alef
    .replace(/[أإآ]/g, 'ا')
    // Normalize Arabic teh marbuta
    .replace(/ة/g, 'ه')
    // Normalize Arabic yeh
    .replace(/ى/g, 'ي')
    // Collapse multiple spaces
    .replace(/\s+/g, ' ');
}
