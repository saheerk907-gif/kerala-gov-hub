import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

describe('RelatedLinks', () => {
  it('component file exists and exports a default function', () => {
    // Read the component source to verify it has a default export
    // We can't execute it in node since it contains JSX, but we can verify the shape
    const sourceFile = join(import.meta.dirname, 'RelatedLinks.jsx');
    const source = readFileSync(sourceFile, 'utf8');
    assert.ok(source.includes('export default function'), 'should have default export function');
    assert.ok(source.includes('links'), 'should accept links parameter');
    assert.ok(source.includes('heading'), 'should accept heading parameter');
  });

  it('link items shape is correct', () => {
    const links = [
      { href: '/pension', label: 'Kerala pension calculator' },
      { href: '/retirement', label: 'Retirement date calculator' },
    ];
    links.forEach(link => {
      assert.ok(typeof link.href === 'string' && link.href.startsWith('/'), 'href must be a relative internal path');
      assert.ok(typeof link.label === 'string' && link.label.length > 0, 'label must not be empty');
    });
  });
});
