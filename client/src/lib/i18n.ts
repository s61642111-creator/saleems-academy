export function isRTL(lang: string): boolean { return lang === 'ar'; }
export function t(en: string, ar: string, lang: 'en' | 'ar'): string { return lang === 'ar' ? ar : en; }