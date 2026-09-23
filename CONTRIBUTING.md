# Contributing

Thanks for helping improve the PacketExchange API specification.

## Reporting a problem

If the specification does not match how the API behaves, [open an issue](https://github.com/PacketExchangeIO/packetexchange-openapi/issues/new/choose) with the operation, what the document says, what the API returned, and the `X-Request-Id` of the request. Please remove API keys, phone numbers and other personal data first.

To report a security vulnerability, follow [SECURITY.md](SECURITY.md) instead.

## Pull requests

The files in `spec/` are generated from the API itself, so edits made directly to them are overwritten by the next sync. Pull requests are welcome for everything else: the README, the checks in `scripts/`, and the CI configuration. For corrections to the specification, an issue is the fastest route.

Before opening a pull request, run:

```sh
npm test
```

This needs Node.js 22 or later and downloads Redocly CLI on first use. There is nothing to install.

## Keeping the specification in sync

Maintainers refresh both editions from the published reference:

```sh
npm run sync
```

`scripts/sync-spec.mjs` does the following:

1. Downloads the current document from `https://packetexchange.io/api/v1/docs/json`. Pass a local file or another URL as an argument to use a different source, for example `node scripts/sync-spec.mjs ./openapi.json`.
2. Runs the publication checks in `scripts/check-spec.mjs` and stops, writing nothing, if the document contains:
   - a path that mentions `admin` or `internal`;
   - the text `/internal` or `/admin`, or the name of an internal infrastructure component, anywhere in the document, including descriptions and enum values;
   - a server that is not `https://` on `packetexchange.io`;
   - any other hostname, a loopback or private IP address, or an internal domain such as `*.internal` or `*.local`.
3. Writes `spec/json/packetexchange.json`, then converts it to `spec/yaml/packetexchange.yaml` with Redocly CLI.
4. Prints the version with path and operation counts, and warns if `info.version` did not change.

Then:

1. Run `npm test` and confirm it passes.
2. Review the diff of `spec/json/packetexchange.json`.
3. Add an entry to [CHANGELOG.md](CHANGELOG.md) and update the version shown in the README.
4. Open a pull request. After it merges, tag the release as `v<info.version>`.

### What `npm test` checks

| Script | Check |
| --- | --- |
| `npm run check` | The JSON edition passes the publication checks above. |
| `npm run check:yaml` | The YAML edition, converted back to JSON, is identical to the JSON edition. |
| `npm run lint` | Both editions pass Redocly CLI's recommended ruleset (see `redocly.yaml`). Errors fail the build; warnings are reported. |

## Code of conduct

This project follows the [Contributor Covenant](CODE_OF_CONDUCT.md). By taking part, you agree to follow it.
