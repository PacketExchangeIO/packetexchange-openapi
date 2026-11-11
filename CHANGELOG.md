# Changelog

All notable changes to this repository are recorded here. Versions follow the API version in `info.version`.

## [1.3.0] - 2026-11-11

### Added

- Route checks: `POST /routes/check` tests up to three routes before you buy, `POST /routes/check/sms` sends a test SMS, and `POST /routes/check/{id}/purchase` buys the routes that passed and sets their order. Results are at `GET /routes/check/{id}` and `GET /routes/checks`.
- Least-cost and failover routing: `GET /purchases/lcr`, `PUT /purchases/lcr-order`, `GET /purchases/failover` and `PUT /purchases/failover/price-limit`. `GET /purchases/owned/{routeId}` tells you whether you already hold a route.
- Revenue share numbers: the market list, taking numbers by id (`POST /revshare/take-bulk`) or by range (`POST /revshare/take-range`), call delivery settings per account and per number, connectivity test calls with SIP traces, live calls, the live access sheet and test results.
- Caller-ID tests: price quotes (`GET /cli-tests/quote`), the countries a route can be tested from, a test across every mobile network in a country (`POST /cli-tests/all-carriers`), speeding up a waiting test, and running a test through a Switch supplier trunk (`POST /switch/suppliers/{id}/cli-test-target`).
- For sellers: a selling overview (`GET /routes/my/summary`), route readiness, coverage, per-network rates and verification, line-type results, test history, a buyer's-eye preview, live calls on your listings, automatic route alerts with the failed calls and SIP behind them, rejected rows from a rate-sheet upload, endpoint status and live endpoint test calls.
- Verify: call-in verification on your own numbers (`/verify/call-in/numbers`, `GET /verify/call-in/coverage`), `GET /verify` for recent verifications and `POST /verify/{id}/simulate-call` for test keys.
- Billing: daily seller earnings, the hold schedule, today's figures and a summary of why calls failed. Top-ups with a saved card and crypto deposit progress.
- The A-Z price list: `GET /price-list/meta`, `GET /price-list.xlsx` and your own prices at `GET /price-list/me.xlsx`.
- Destination alerts (`/account/destination-alerts`), notification email preferences, call capacity per phone number (`/dids/{id}/call-capacity`), the addresses to allow for a route you sell, draft listings, `GET /status/active`, `GET /public/test-coverage` and the number catalogue summary.
- Switch: bulk discontinue of customer sell rates, bulk removal of supplier cost rows, a drill-down for one customer, supplier or destination, and calls in progress by country pair.

### Removed

These operations only work from a signed-in browser session and refuse API keys, so they are no longer part of the developer reference. They still work in the dashboard.

- Sign-in, sign-up, password, email-link and session operations under `/auth`. Integrations authenticate with an API key.
- Two-factor setup, email change and account closure under `/account`, saved searches, favourites, onboarding and walkthrough state, the Switch subscription checkout and billing portal, and the Switch trial application.
- Identity verification (`/kyc`), the first-call guide (`/first-call`), listing claim links, seller payout requests (`/payouts`, `POST /revshare/payouts`), card setup for auto-recharge (`POST /topups/setup-intent`) and the Switch console mode.

## [1.2.0] - 2026-09-23

### Added

- Number lookup: `GET /lookup/{number}` returns validity, formatting, country, line type, the network where the marketplace's rate decks agree, risk flags and the cheapest voice and SMS price, with SMS prices per destination network where the route prices that way.
- SMS delivery status: `GET /comms/sms/{messageId}` returns a timeline (queued, sent, then delivered or failed). The `sms.delivered` and `sms.failed` webhook events report the same changes.
- Asynchronous calls: `POST /comms/calls` accepts `async: true` and answers 202 with a `callId`; `GET /comms/calls/{id}` returns live status, cost, hangup reason and gathered digits. The `call.ringing`, `call.answered` and `call.gathered` webhook events follow a call.
- Call actions on `POST /comms/calls`: `say` (en, es, fr, de, pt, hi), `play` (an https MP3), `gather`, `pause` and `hangup`.
- SMS sends return a `network` object when the route prices per destination network.
- `GET /pricing/destinations` and `GET /pricing/destinations/{slug}`.
- The `webhooks:write` API key scope: webhook endpoints can be created, updated, deleted and rotated with a key that holds it.
- The `TEST_KEY_NOT_ALLOWED` error code (403) for operations that have no test mode.

### Changed

- The message identifier on `DidMessage` and on the `POST /dids/{id}/messages` response is now named `providerMessageId`.

## [1.1.0] - 2026-09-23

### Added

- Initial public release of the PacketExchange API specification, version 1.1.0: 634 paths and 782 operations.
- JSON edition in `spec/json/packetexchange.json` and YAML edition in `spec/yaml/packetexchange.yaml`.
- Continuous integration that lints both editions with Redocly CLI, checks that the YAML matches the JSON, and checks that the document describes only the public API.

[1.3.0]: https://github.com/PacketExchangeIO/packetexchange-openapi/releases/tag/v1.3.0
[1.2.0]: https://github.com/PacketExchangeIO/packetexchange-openapi/releases/tag/v1.2.0
[1.1.0]: https://github.com/PacketExchangeIO/packetexchange-openapi/releases/tag/v1.1.0
