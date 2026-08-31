# @alexstevovich/deterministic-code-points

Generate a deterministic string from a code-point alphabet.

## API

`deterministicCodePoints(alphabet, length, seed)` uses SHA-256 and unbiased
selection to return the same code-point sequence for the same inputs. `seed`
may be a string or `Buffer`.

## Installation

This package is private until it has been explicitly reviewed for publication.
Once published, install it with:

```sh
npm install @alexstevovich/deterministic-code-points
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

MIT. Copyright (c) 2025 Alex Stevovich
(https://alexstevovich.com).
