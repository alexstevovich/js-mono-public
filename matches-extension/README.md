# @alexstevovich/matches-extension

Check whether a name ends with an allowed extension.

## API

`matchesExtension(name, extensions)` performs case-sensitive suffix matching,
including compound extensions such as `.tar.gz`. An omitted or empty extension
list matches every name.

## Installation

This package is private until it has been explicitly reviewed for publication.
Once published, install it with:

```sh
npm install @alexstevovich/matches-extension
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

MIT. Copyright (c) 2026 Alex Stevovich
(https://alexstevovich.com).
