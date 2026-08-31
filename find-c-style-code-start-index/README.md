# @alexstevovich/find-c-style-code-start-index

Find the first code index after C-style comments.

## API

`findCStyleCodeStartIndex(content)` skips a leading shebang, whitespace, and
C-style comments. It returns `-1` when no code exists.

## Installation

This package is private until it has been explicitly reviewed for publication.
Once published, install it with:

```sh
npm install @alexstevovich/find-c-style-code-start-index
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
