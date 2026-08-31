# @alexstevovich/filter-single-code-point-graphemes

Keep only graphemes composed of one Unicode code point.

## API

`filterSingleCodePointGraphemes(input, { locale })` uses `Intl.Segmenter` and
removes combining sequences, flags, and ZWJ clusters while retaining
single-code-point graphemes.

## Installation

This package is private until it has been explicitly reviewed for publication.
Once published, install it with:

```sh
npm install @alexstevovich/filter-single-code-point-graphemes
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
