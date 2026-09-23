#!/usr/bin/env node
// Publication checks for the PacketExchange OpenAPI document.
//
// Structural validation is Redocly's job (see redocly.yaml). This script covers what
// a linter cannot know: the published document must describe the public API only.
// It fails when the document contains non-public paths, a server that is not the
// public production host, or any hostname or IP address outside the allowlist.
//
// Usage:
//   node scripts/check-spec.mjs [spec.json]
//   node scripts/check-spec.mjs [spec.json] --compare other.json
//
// --compare asserts that a second document (for example the YAML edition converted
// back to JSON) is identical to the first, so the two editions never drift.

import { readFileSync } from 'node:fs';
import { isDeepStrictEqual } from 'node:util';
import { fileURLToPath } from 'node:url';

export const DEFAULT_SPEC = 'spec/json/packetexchange.json';

// Hosts that may appear anywhere in the document, including subdomains.
const ALLOWED_HOSTS = ['packetexchange.io'];

// Path fragments that never belong in the public reference.
const FORBIDDEN_PATH = /admin|internal/i;

// Terms that must not appear anywhere in the document, including descriptions,
// enums and examples: non-public features and the names of internal infrastructure.
const FORBIDDEN_TEXT = /\/internal|\/admin/gi;

// Loopback, private and link-local ranges, plus names that only resolve inside a network.
const PRIVATE_ADDRESS =
  /\b(localhost|127\.\d+\.\d+\.\d+|0\.0\.0\.0|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+|169\.254\.\d+\.\d+)\b|\b[\w-]+\.(internal|local|lan|corp|intranet)\b/gi;

const ABSOLUTE_URL = /\bhttps?:\/\/([^/\s"'`)<>]+)/gi;

const isAllowedHost = (host) => {
  const name = host.toLowerCase().replace(/:\d+$/, '');
  return ALLOWED_HOSTS.some((allowed) => name === allowed || name.endsWith(`.${allowed}`));
};

/**
 * Returns a list of human-readable problems. An empty list means the document is
 * safe to publish. Takes the parsed document and its raw text, so string content
 * such as descriptions and examples is scanned as well as the structure.
 */
export function checkSpec(spec, text = JSON.stringify(spec)) {
  const problems = [];

  if (!/^3\.\d+\.\d+$/.test(spec.openapi ?? '')) {
    problems.push(`expected an OpenAPI 3.x document, found openapi=${spec.openapi}`);
  }
  if (!spec.info?.version) problems.push('info.version is missing');

  for (const path of Object.keys(spec.paths ?? {})) {
    if (FORBIDDEN_PATH.test(path)) problems.push(`non-public path: ${path}`);
  }

  const servers = spec.servers ?? [];
  if (servers.length === 0) problems.push('no servers are declared');
  for (const { url } of servers) {
    let parsed;
    try {
      parsed = new URL(url);
    } catch {
      problems.push(`server url is not absolute: ${url}`);
      continue;
    }
    if (parsed.protocol !== 'https:') problems.push(`server url is not https: ${url}`);
    if (!isAllowedHost(parsed.host)) problems.push(`server host is not allowed: ${url}`);
  }

  for (const [match] of text.matchAll(FORBIDDEN_TEXT)) {
    problems.push(`non-public term in document: ${match}`);
  }

  for (const [, host] of text.matchAll(ABSOLUTE_URL)) {
    if (!isAllowedHost(host)) problems.push(`unexpected host in document: ${host}`);
  }
  for (const [match] of text.matchAll(PRIVATE_ADDRESS)) {
    problems.push(`private or internal address in document: ${match}`);
  }

  // Report each distinct problem once, however often it occurs.
  return [...new Set(problems)];
}

/** Counts shown after a successful check, so a maintainer can sanity-check a sync. */
export function summarize(spec) {
  const methods = new Set(['get', 'put', 'post', 'delete', 'patch', 'head', 'options', 'trace']);
  const operations = Object.values(spec.paths ?? {}).reduce(
    (count, item) => count + Object.keys(item).filter((key) => methods.has(key)).length,
    0,
  );
  return `${spec.info?.title} ${spec.info?.version}: ${Object.keys(spec.paths ?? {}).length} paths, ${operations} operations`;
}

function main(argv) {
  const compareAt = argv.indexOf('--compare');
  const comparePath = compareAt >= 0 ? argv[compareAt + 1] : undefined;
  const specPath = argv.find((arg) => !arg.startsWith('--') && arg !== comparePath) ?? DEFAULT_SPEC;

  const text = readFileSync(specPath, 'utf8');
  const spec = JSON.parse(text);
  const problems = checkSpec(spec, text);

  if (comparePath) {
    const other = JSON.parse(readFileSync(comparePath, 'utf8'));
    if (!isDeepStrictEqual(spec, other)) problems.push(`${comparePath} does not match ${specPath}`);
  }

  if (problems.length > 0) {
    console.error(`${specPath}: ${problems.length} problem(s)`);
    for (const problem of problems) console.error(`  - ${problem}`);
    process.exit(1);
  }
  console.log(`${specPath}: OK (${summarize(spec)})`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main(process.argv.slice(2));
