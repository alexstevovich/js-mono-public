# @alexstevovich/path-byte-size

Measure a file or directory tree in bytes.

## API

`await pathByteSize(target, { onError })` returns a file's size or the sum of
files in a directory tree. Symbolic links are not followed. Set `onError` to
`'ignore'` to treat inaccessible entries as zero bytes.

## Installation

This package is private until it has been explicitly reviewed for publication.
Once published, install it with:

```sh
npm install @alexstevovich/path-byte-size
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
