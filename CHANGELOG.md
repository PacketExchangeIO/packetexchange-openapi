# Changelog

All notable changes to this repository are recorded here. Versions follow the API version in `info.version`.

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

[1.2.0]: https://github.com/PacketExchangeIO/packetexchange-openapi/releases/tag/v1.2.0
[1.1.0]: https://github.com/PacketExchangeIO/packetexchange-openapi/releases/tag/v1.1.0
