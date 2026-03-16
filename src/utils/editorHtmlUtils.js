import { createElement } from 'react';

/**
 * HTML rendering utility for editor-stored content.
 *
 * Why this exists:
 * - Rich editor fields are persisted as HTML strings.
 * - Detail pages must render that HTML with formatting preserved.
 * - Raw HTML rendering must be constrained to reduce XSS risk.
 *
 * Design goals:
 * 1) Keep implementation lightweight (no extra runtime dependency).
 * 2) Sanitize obvious dangerous nodes/attributes.
 * 3) Convert sanitized DOM into React nodes, not raw innerHTML.
 */

// Strictly limited allow-list of tags we want to keep in rendered output.
// Any unknown tag will be flattened into text/children.
const ALLOWED_HTML_TAGS = new Set([
  'p',
  'br',
  'strong',
  'b',
  'em',
  'i',
  'u',
  's',
  'span',
  'div',
  'ul',
  'ol',
  'li',
  'blockquote',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'table',
  'thead',
  'tbody',
  'tr',
  'th',
  'td',
  'a',
  'img',
]);

// Allowed attributes by tag.
// Attributes not listed here are dropped during React node conversion.
const ALLOWED_HTML_ATTRS = {
  a: ['href', 'target', 'title'],
  img: ['src', 'alt', 'title', 'width', 'height'],
  td: ['colspan', 'rowspan'],
  th: ['colspan', 'rowspan'],
};

// Guard for DOMParser usage. Utility is primarily for browser rendering.
// In non-browser context we return a safe fallback string.
const isBrowser = () =>
  typeof window !== 'undefined' && typeof window.DOMParser !== 'undefined';

/**
 * Sanitize HTML string from editor content.
 *
 * Current sanitation strategy:
 * - Remove high-risk elements entirely (script, iframe, embed, etc.).
 * - Remove all inline event attributes (onClick, onError, ...).
 * - Remove javascript: protocol from href/src.
 *
 * Note:
 * - This is a pragmatic allow/deny hybrid, not a full HTML sanitizer engine.
 * - If security requirements become stricter, consider dedicated sanitizer lib.
 */
export const sanitizeHtml = (value) => {
  const raw = String(value || '').trim();
  if (!raw) return '';
  // SSR/non-browser fallback: return original trimmed string.
  // Callers should avoid treating this as trusted HTML on server side.
  if (!isBrowser()) return raw;

  const parser = new window.DOMParser();
  const doc = parser.parseFromString(raw, 'text/html');

  // Remove clearly dangerous or out-of-scope container nodes.
  doc
    .querySelectorAll('script,style,iframe,object,embed,link,meta')
    .forEach((node) => node.remove());

  // Clean per-attribute risks.
  doc.querySelectorAll('*').forEach((el) => {
    Array.from(el.attributes).forEach((attr) => {
      const name = attr.name.toLowerCase();
      const attrValue = attr.value || '';

      // Drop all inline JS handlers.
      if (name.startsWith('on')) {
        el.removeAttribute(attr.name);
        return;
      }

      // Drop javascript: URLs from navigable/loadable attributes.
      if (
        (name === 'href' || name === 'src') &&
        /^\s*javascript:/i.test(attrValue)
      ) {
        el.removeAttribute(attr.name);
      }
    });
  });

  return doc.body.innerHTML.trim();
};

/**
 * Convert a DOM node into a React node recursively.
 *
 * Conversion policy:
 * - Text node: keep text content.
 * - Unknown/blocked element: unwrap and keep only children.
 * - Allowed element: create React element with allowed attributes only.
 */
const toReactNode = (node, key) => {
  if (!node) return null;
  if (node.nodeType === 3) return node.textContent;
  if (node.nodeType !== 1) return null;

  const tag = node.tagName.toLowerCase();
  const children = Array.from(node.childNodes)
    .map((child, idx) => toReactNode(child, `${key}-${idx}`))
    .filter((child) => child !== null && child !== undefined);

  if (!ALLOWED_HTML_TAGS.has(tag)) {
    return children.length > 0
      ? createElement('span', { key }, children)
      : null;
  }

  const props = { key };
  const allowedAttrs = ALLOWED_HTML_ATTRS[tag] || [];
  allowedAttrs.forEach((attrName) => {
    const attrValue = node.getAttribute(attrName);
    if (!attrValue) return;

    // React DOM attribute naming bridge.
    if (attrName === 'colspan') {
      props.colSpan = attrValue;
      return;
    }
    if (attrName === 'rowspan') {
      props.rowSpan = attrValue;
      return;
    }
    props[attrName] = attrValue;
  });

  // Always enforce safe link relation when target is present.
  if (tag === 'a') {
    props.rel = 'noopener noreferrer';
  }

  return createElement(tag, props, children.length > 0 ? children : undefined);
};

/**
 * Render editor HTML as React nodes.
 *
 * @param {string|null|undefined} value - raw editor HTML
 * @param {string|React.ReactNode} emptyText - fallback when no renderable content
 * @returns {React.ReactNode}
 */
export const renderEditorHtml = (value, emptyText = '-') => {
  const html = sanitizeHtml(value);
  if (!html) return emptyText;

  // Browser-only DOM parsing path.
  // In non-browser runtime, return sanitized string as a fallback.
  if (!isBrowser()) return html;

  const parser = new window.DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const nodes = Array.from(doc.body.childNodes)
    .map((node, idx) => toReactNode(node, `editor-node-${idx}`))
    .filter((node) => node !== null && node !== undefined);

  if (nodes.length === 0) return emptyText;
  return createElement('div', { className: 'editor-html-content' }, nodes);
};
