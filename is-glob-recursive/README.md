# @alexstevovich/is-glob-recursive

Check whether a glob contains a recursive globstar segment.

## API

`isGlobRecursive(pattern)` returns `true` when `**` occurs as a complete path
segment. Substrings such as `foo**bar` are not treated as recursive globstars.

## Installation

This package is private until it has been explicitly reviewed for publication.
Once published, install it with:

```sh
npm install @alexstevovich/is-glob-recursive
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
