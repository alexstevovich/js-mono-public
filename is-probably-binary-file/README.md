# @alexstevovich/is-probably-binary-file

Estimate whether a file is binary by scanning for null bytes.

## API

`await isProbablyBinaryFile(filePath, options)` scans the first 8 KiB for a
null byte. Configure the byte count with `bytes`; `onError` may be `'throw'`,
`'binary'`, or `'text'`. This is a heuristic, not a complete content classifier.

## Installation

This package is private until it has been explicitly reviewed for publication.
Once published, install it with:

```sh
npm install @alexstevovich/is-probably-binary-file
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
