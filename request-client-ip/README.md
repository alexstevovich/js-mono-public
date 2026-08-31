# @alexstevovich/request-client-ip

Resolve a client IP address from a Node.js request.

## API

`resolveRequestClientIp(request, options?)` returns the socket address by
default. The legacy `request.connection.remoteAddress` property is supported as
a fallback.

Set `options.trustProxy` to `true` to prefer the first address in
`X-Forwarded-For`, followed by a framework-provided `request.ip`. Only enable
this when requests pass through a trusted proxy that replaces forwarded
headers; otherwise clients can spoof the reported address.

`options.fallback` defaults to `"0.0.0.0"` and may be set to another value such
as `null`.

## Installation

This package is private until it has been explicitly reviewed for publication.
Once published, install it with:

```sh
npm install @alexstevovich/request-client-ip
```

## Development

```sh
npm install
npm run lint
npm run format:check

npm test
```

The package uses ECMAScript modules. Its public entry point is
`src/index.js`.

## License

MIT. Copyright (c) 2026 Alex Stevovich
(https://alexstevovich.com).
