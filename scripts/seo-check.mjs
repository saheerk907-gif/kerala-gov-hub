#!/usr/bin/env node
/**
 * SEO enforcement: fail if any app page exports raw metadata bypassing buildMetadata().
 * Run: node scripts/seo-check.mjs
 */
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

// Find all files that export const metadata in src/app
let files;
try {
  files = execSync(
    `grep -rl "export const metadata" src/app --include="*.js" --include="*.jsx"`,
    { encoding: 'utf8', cwd: process.cwd() }
  ).trim().split('\n').filter(Boolean);
} catch {
  // grep returns exit 1 if no matches
  files = [];
}

// Root layout is allowed to export raw metadata (global default, not a page)
// Admin is excluded (not a public page)
const allowed = ['src/app/layout.js', 'src/app/admin/layout.js'];

const violations = [];

for (const file of files) {
  if (allowed.some(a => file.endsWith(a))) continue;

  const content = readFileSync(file, 'utf8');
  if (!content.includes('buildMetadata')) {
    violations.push(file);
  }
}

if (violations.length > 0) {
  console.error('\n❌ SEO violation: raw metadata export found (must use buildMetadata):\n');
  violations.forEach(f => console.error(`  ${f}`));
  console.error('\nFix: import { buildMetadata } from "@/lib/seo" and use it.\n');
  process.exit(1);
}

console.log(`✓ SEO check passed — ${files.length} pages checked, all use buildMetadata.`);
