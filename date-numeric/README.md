# @alexstevovich/date-numeric

Format a date as a concise numeric US date.

## API

`dateNumeric(date, options)` formats a valid `Date` as `MM/DD/YY`. Optional
values are forwarded to `Intl.DateTimeFormat` and can set `timeZone`.

## Installation

This package is private until it has been explicitly reviewed for publication.
Once published, install it with:

```sh
npm install @alexstevovich/date-numeric
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
