import DOMPurify from 'dompurify';

const cache = new Map<string, string>();

/**
 * Tech icons are stored as raw SVG markup in the database. Strip anything that could run
 * script (event handlers, <script>, <foreignObject>, javascript: links) before rendering.
 */
export const sanitizeSvg = (markup: string): string => {
  const cached = cache.get(markup);
  if (cached !== undefined) return cached;

  // DOMPurify needs a DOM; during SSR prerendering render nothing and let the client fill it in
  if (typeof window === 'undefined') return '';

  const clean = DOMPurify.sanitize(markup, {
    USE_PROFILES: { svg: true, svgFilters: true },
    FORBID_TAGS: ['foreignObject', 'script', 'style'],
  });
  cache.set(markup, clean);
  return clean;
};
