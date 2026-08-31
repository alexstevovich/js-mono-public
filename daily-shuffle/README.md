# @alexstevovich/daily-shuffle

Deterministically shuffle an array for a given UTC date.

## API

`dailyShuffle(items, date = new Date())` returns a shuffled copy. Calls using
the same UTC calendar date produce the same ordering.

## Installation

This package is private until it has been explicitly reviewed for publication.
Once published, install it with:

```sh
npm install @alexstevovich/daily-shuffle
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
