#!/usr/bin/env node
// Refreshes both editions of the specification from a source document.
//
// The source is the published reference by default, or any local file or URL passed
// as the first argument. The document is checked before anything is written, so a
// source that exposes non-public paths or hosts never reaches the repository.
//
// Usage:
//   node scripts/sync-spec.mjs                      # from the published reference
//   node scripts/sync-spec.mjs ./openapi.json       # from a local file
//   node scripts/sync-spec.mjs https://example/...  # from another URL

import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { checkSpec, summarize, DEFAULT_SPEC } from './check-spec.mjs';

const PUBLISHED_SPEC_URL = 'https://packetexchange.io/api/v1/docs/json';
const YAML_SPEC = 'spec/yaml/packetexchange.yaml';
// Pinned so the YAML output only changes when the document does.
const REDOCLY = '@redocly/cli@2.54.2';

async function load(source) {
  if (/^https?:\/\//.test(source)) {
    const res = await fetch(source, { headers: { accept: 'application/json' } });
    if (!res.ok) throw new Error(`GET ${source} answered ${res.status}`);
    return res.text();
  }
  return readFileSync(source, 'utf8');
}

const source = process.argv[2] ?? PUBLISHED_SPEC_URL;
const spec = JSON.parse(await load(source));

const problems = checkSpec(spec);
if (problems.length > 0) {
  console.error(`Refusing to publish ${source}:`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}

const previous = JSON.parse(readFileSync(DEFAULT_SPEC, 'utf8'));
writeFileSync(DEFAULT_SPEC, `${JSON.stringify(spec, null, 2)}\n`);

// Redocly's bundler converts JSON to YAML without resolving or reordering anything.
execFileSync('npx', ['-y', REDOCLY, 'bundle', DEFAULT_SPEC, '--ext', 'yaml', '-o', YAML_SPEC], {
  stdio: 'inherit',
});

console.log(`Synced ${summarize(spec)}`);
if (previous.info?.version === spec.info?.version) {
  console.log(`info.version is unchanged (${spec.info.version}); confirm that is intended.`);
}
console.log('Next: run `npm test`, then add an entry to CHANGELOG.md.');
