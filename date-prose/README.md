# @alexstevovich/date-prose

Format a date as prose in US English.

## API

`dateProse(date, options)` formats a valid `Date` like `August 30, 2026`.
Optional values are forwarded to `Intl.DateTimeFormat`.

## Installation

This package is private until it has been explicitly reviewed for publication.
Once published, install it with:

```sh
npm install @alexstevovich/date-prose
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
