# @alexstevovich/glob-base-dir

Extract the static base directory from a glob pattern.

## API

`globBaseDir(pattern)` returns the path before the first segment containing
glob syntax. A root-level relative glob returns `.`.

## Installation

This package is private until it has been explicitly reviewed for publication.
Once published, install it with:

```sh
npm install @alexstevovich/glob-base-dir
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
