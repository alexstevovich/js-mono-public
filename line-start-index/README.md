# @alexstevovich/line-start-index

Find the start index of the line containing an index.

## API

`lineStartIndex(content, index)` returns the containing line's start, including
for an index at the end of the string. Invalid indexes return `-1`.

## Installation

This package is private until it has been explicitly reviewed for publication.
Once published, install it with:

```sh
npm install @alexstevovich/line-start-index
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
