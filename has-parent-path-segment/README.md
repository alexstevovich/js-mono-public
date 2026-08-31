# @alexstevovich/has-parent-path-segment

Check a path-like string for a parent-directory segment.

## API

`hasParentPathSegment(value)` detects a complete `..` segment across forward
and backward slash styles. It is a conservative building block for checking
glob or path traversal.

## Installation

This package is private until it has been explicitly reviewed for publication.
Once published, install it with:

```sh
npm install @alexstevovich/has-parent-path-segment
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
