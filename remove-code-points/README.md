# @alexstevovich/remove-code-points

Remove selected Unicode code points from a string.

## API

`removeCodePoints(source, removed)` removes every code point present in
`removed` while preserving the order and repetition of remaining code points.

## Installation

This package is private until it has been explicitly reviewed for publication.
Once published, install it with:

```sh
npm install @alexstevovich/remove-code-points
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
