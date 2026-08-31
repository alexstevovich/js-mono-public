# @alexstevovich/random-code-points

Generate a cryptographically random string from code points.

## API

`randomCodePoints(alphabet, length)` selects complete Unicode code points with
`node:crypto`. Repeated alphabet entries intentionally carry repeated weight.

## Installation

This package is private until it has been explicitly reviewed for publication.
Once published, install it with:

```sh
npm install @alexstevovich/random-code-points
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
