# @alexstevovich/extract-shebang

Separate a leading shebang line from text content.

## API

`extractShebang(content)` returns `{ shebang, content }`. A shebang is
extracted only when it begins at index zero and ends with a newline.

## Installation

This package is private until it has been explicitly reviewed for publication.
Once published, install it with:

```sh
npm install @alexstevovich/extract-shebang
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
