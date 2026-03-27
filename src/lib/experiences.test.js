import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  trendingScore,
  readTime,
  extractPullQuote,
  splitBodyForQuote,
  isNew,
  whatsappUrl,
} from './experiences.js';

describe('trendingScore', () => {
  it('favours recent reactions over old ones', () => {
    const recentPost = trendingScore(10, 10, new Date(Date.now() - 3_600_000).toISOString()); // 1h old
    const oldPost   = trendingScore(10, 10, new Date(Date.now() - 720 * 3_600_000).toISOString()); // 30d old
    assert.ok(recentPost > oldPost, 'recent post should score higher');
  });

  it('boosts recent reactions 2x vs total', () => {
    const sameAge = new Date(Date.now() - 24 * 3_600_000).toISOString();
    const highRecent = trendingScore(10, 0, sameAge);
    const highTotal  = trendingScore(0, 10, sameAge);
    assert.ok(highRecent > highTotal, 'recent reactions should outweigh total');
  });
});

describe('readTime', () => {
  it('returns 1 for empty body', () => {
    assert.equal(readTime(''), 1);
    assert.equal(readTime(null), 1);
  });

  it('returns 1 for short text', () => {
    assert.equal(readTime('hello world'), 1);
  });

  it('returns 2 for 250-word body', () => {
    const body = Array(250).fill('word').join(' ');
    assert.equal(readTime(body), 2);
  });
});

describe('extractPullQuote', () => {
  it('returns null for short body', () => {
    assert.equal(extractPullQuote('short text'), null);
  });

  it('extracts first segment split by ।', () => {
    const long = 'a'.repeat(50) + '।' + 'b'.repeat(100) + '।' + 'c'.repeat(50);
    // Second segment (b*100) is 60-200 chars
    const quote = extractPullQuote(long.padStart(310, 'x'));
    assert.ok(quote !== null);
  });

  it('falls back to first 120 codepoints when no । found', () => {
    const body = 'x'.repeat(400);
    const quote = extractPullQuote(body);
    assert.equal([...quote].length, 120);
  });
});

describe('splitBodyForQuote', () => {
  it('splits at 150 codepoints', () => {
    const body = 'a'.repeat(300);
    const [before, after] = splitBodyForQuote(body);
    assert.equal([...before].length, 150);
    assert.equal([...after].length, 150);
  });
});

describe('isNew', () => {
  it('returns true for post published 1 hour ago', () => {
    const oneHourAgo = new Date(Date.now() - 3_600_000).toISOString();
    assert.ok(isNew(oneHourAgo));
  });

  it('returns false for post published 2 days ago', () => {
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 3_600_000).toISOString();
    assert.ok(!isNew(twoDaysAgo));
  });

  it('returns false for null', () => {
    assert.ok(!isNew(null));
  });
});

describe('whatsappUrl', () => {
  it('generates a valid wa.me URL', () => {
    const url = whatsappUrl('Test Title', 'test-123');
    assert.ok(url.startsWith('https://wa.me/?text='), 'should start with wa.me');
    assert.ok(url.includes(encodeURIComponent('Test Title')), 'should include encoded title');
    assert.ok(url.includes('test-123'), 'should include experience id');
  });
});
