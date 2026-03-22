import sanitizeHtml from 'sanitize-html';

const ALLOWED_TAGS = [
  'h1', 'h2', 'h3', 'h4', 'p', 'br', 'strong', 'b', 'em', 'i', 'u',
  'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'table', 'thead', 'tbody',
  'tr', 'th', 'td', 'span', 'div',
];

const ALLOWED_ATTRIBUTES = {
  'a':   ['href', 'target', 'rel'],
  'img': ['src', 'alt', 'width', 'height'],
  '*':   ['class', 'style'],
};

export function sanitize(html) {
  if (!html) return '';
  return sanitizeHtml(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTRIBUTES,
    allowedStyles: {
      '*': {
        'text-align': [/^(left|right|center|justify)$/],
        'font-weight': [/^\d+$/],
      },
    },
    // Force safe values on links
    transformTags: {
      'a': sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' }),
    },
  });
}
