<p align="center">
  <a href="https://packetexchange.io"><img src="assets/banner.png" alt="PacketExchange OpenAPI specification" width="100%"></a>
</p>

<p align="center">The OpenAPI 3.0 description of the PacketExchange voice and SMS marketplace API.</p>

<p align="center">
  <a href="https://github.com/PacketExchangeIO/packetexchange-openapi/actions/workflows/ci.yml"><img src="https://github.com/PacketExchangeIO/packetexchange-openapi/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT license"></a>
  <a href="CHANGELOG.md"><img src="https://img.shields.io/badge/API%20version-1.2.0-informational.svg" alt="API version 1.2.0"></a>
  <img src="https://img.shields.io/badge/OpenAPI-3.0.3-6BA539.svg" alt="OpenAPI 3.0.3">
</p>

This repository holds the machine-readable contract for the PacketExchange REST API. Use it to generate a client in your language, import the API into an HTTP tool, or check your integration against the documented request and response shapes.

For the official SDKs, see [packetexchange-node](https://github.com/PacketExchangeIO/packetexchange-node) and [packetexchange-python](https://github.com/PacketExchangeIO/packetexchange-python).

## Files

| File | Format |
| --- | --- |
| [`spec/json/packetexchange.json`](spec/json/packetexchange.json) | OpenAPI 3.0.3, JSON |
| [`spec/yaml/packetexchange.yaml`](spec/yaml/packetexchange.yaml) | OpenAPI 3.0.3, YAML (same content) |

Both files describe API version **1.2.0**: 639 paths and 788 operations. The base URL is `https://packetexchange.io/api/v1`.

## What's covered

Every customer-facing operation, each with a summary, its access rule and a response schema:

- **Marketplace:** browse and search voice and SMS routes, route details, market summaries, rate sheets, offers, route access and route reports.
- **Purchases and routing:** buy access to a route, see usage, and preview which route Smart Routing would pick for a destination.
- **Voice and SMS:** send an SMS and follow its delivery status, place a call (synchronous, or asynchronous with a status endpoint) with call actions (`say`, `play`, `gather`, `pause`, `hangup`), read a one-time passcode by voice call, and the Verify flow (`/verify/start`, `/verify/check`).
- **Number lookup:** country, line type, network, risk flags and the cheapest voice and SMS price for a number (`/lookup/{number}`).
- **Phone numbers:** search the number catalogue, buy and manage numbers, and configure their voice and SMS handling.
- **Account:** balance, API keys and their scopes, API usage, webhooks and delivery logs, notifications.
- **Billing:** transactions, top-ups, CDR exports and payouts.
- **Switch:** customers, customer trunks, suppliers, rating, routing, CDRs and analytics, invoicing and operations for accounts on a Switch plan.
- **Also:** dialer campaigns, CLI tests, do-not-call lists, interconnections, support tickets, compliance and platform status.

The document's `info.description` covers authentication, the response envelope, money formatting, rate limits, request ids and the full list of error codes.

## Quick start

Using the API needs a PacketExchange account with prepaid credit: sign up at [packetexchange.io](https://packetexchange.io) and add credit. Then create an API key in the dashboard under **API keys** and keep it in an environment variable:

```sh
export PACKETEXCHANGE_API_KEY="your-api-key"

curl https://packetexchange.io/api/v1/account/balance \
  -H "Authorization: Bearer $PACKETEXCHANGE_API_KEY"
```

Every response uses the same envelope:

```json
{ "success": true, "data": { } }
```

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [{ "path": "to", "message": "Invalid" }]
  }
}
```

Quote the `X-Request-Id` response header when you contact support about a specific request.

## Generate a client

The document works with standard OpenAPI tooling. With [OpenAPI Generator](https://openapi-generator.tech):

```sh
npx @openapitools/openapi-generator-cli generate \
  -i https://raw.githubusercontent.com/PacketExchangeIO/packetexchange-openapi/main/spec/yaml/packetexchange.yaml \
  -g typescript-fetch \
  -o ./packetexchange-client
```

Replace `typescript-fetch` with any [supported generator](https://openapi-generator.tech/docs/generators), for example `python`, `go`, `java`, `csharp`, `php` or `ruby`. Generated clients authenticate with a bearer token: set it from `PACKETEXCHANGE_API_KEY` rather than writing the key into code.

Amounts are US dollars as decimal strings with six places (`"0.012500"`). Keep them as strings or decimals in your code, not floating-point numbers.

## Import into Postman

1. In Postman, choose **Import** and paste the raw URL of `spec/json/packetexchange.json`, or upload the file.
2. Select **OpenAPI 3.0** and import it as a collection.
3. Set the collection's **Authorization** to **Bearer Token** with the value `{{PACKETEXCHANGE_API_KEY}}`, and define that variable in a Postman environment.

Insomnia, Bruno and similar tools import the same file.

## Build a local reference

```sh
npx @redocly/cli build-docs spec/yaml/packetexchange.yaml -o packetexchange-api.html
```

This writes a single HTML page you can open offline.

The hosted reference is at [packetexchange.io/api-docs](https://packetexchange.io/api-docs).

## Things to know

- API keys look like `wmmn_live_sk_...` (live) and `wmmn_test_sk_...` (test). Some account-management operations accept a dashboard session only and refuse API keys; each operation states its access rule and, for scoped keys, the scope it needs. Managing webhook endpoints needs the `webhooks:write` scope, which a full-access key does not include.
- A test key refuses operations that have no test mode, such as Switch changes and x402 top-ups, with 403 `TEST_KEY_NOT_ALLOWED`.
- ASR and ACD figures on marketplace listings are stated by the seller.
- The status returned when you send an SMS is the send-time outcome (accepted, sent or failed). `GET /comms/sms/{messageId}` then shows the delivery timeline; a message is `delivered` only when a carrier delivery receipt confirms it, and on routes that return no receipts it stays `sent`.
- Number lookup is prefix-based: it does not query the carrier, so it cannot tell whether a number is in service or has been ported.
- Voice passcodes and spoken call actions can use English, Spanish, French, German, Portuguese and Hindi (`en`, `es`, `fr`, `de`, `pt`, `hi`).

## Versioning

`info.version` follows the API. Changes to this repository are listed in [CHANGELOG.md](CHANGELOG.md). Maintainers refresh the files with `npm run sync`; see [CONTRIBUTING.md](CONTRIBUTING.md#keeping-the-specification-in-sync).

## Links

- Developers: [packetexchange.io/developers](https://packetexchange.io/developers)
- API reference: [packetexchange.io/api-docs](https://packetexchange.io/api-docs)
- Support: [support@packetexchange.io](mailto:support@packetexchange.io)
- Security reports: see [SECURITY.md](SECURITY.md)

## License

[MIT](LICENSE)
