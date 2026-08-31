# @alexstevovich/random-graphemes

Generate a cryptographically random string from graphemes.

## API

`randomGraphemes(alphabet, length, { locale })` segments the alphabet with
`Intl.Segmenter` and selects complete grapheme clusters with `node:crypto`.

## Installation

This package is private until it has been explicitly reviewed for publication.
Once published, install it with:

```sh
npm install @alexstevovich/random-graphemes
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
