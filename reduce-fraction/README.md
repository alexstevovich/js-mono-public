# @alexstevovich/reduce-fraction

Reduce an integer fraction to normalized lowest terms.

## API

`reduceFraction(numerator, denominator)` returns a string such as `"2/3"`.
Both arguments must be safe integers, and the denominator cannot be zero. A
negative result places its sign on the numerator, and zero reduces to `0/1`.

## Installation

This package is private until it has been explicitly reviewed for publication.
Once published, install it with:

```sh
npm install @alexstevovich/reduce-fraction
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
