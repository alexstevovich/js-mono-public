# @alexstevovich/strip-glob-base-dir

Remove the static base directory from a glob pattern.

## API

`stripGlobBaseDir(pattern)` returns the glob beginning at its first dynamic
segment using forward slashes, or an empty string when no glob syntax exists.

## Installation

This package is private until it has been explicitly reviewed for publication.
Once published, install it with:

```sh
npm install @alexstevovich/strip-glob-base-dir
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
