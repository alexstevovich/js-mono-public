# @alexstevovich/has-binary-extension

Check whether a path has a commonly binary file extension.

## API

`hasBinaryExtension(filePath, extensions)` performs a case-insensitive check
against a built-in extension set. Pass a custom `Set`-like value to replace the
defaults. This classifies by filename only and does not inspect file contents.

## Installation

This package is private until it has been explicitly reviewed for publication.
Once published, install it with:

```sh
npm install @alexstevovich/has-binary-extension
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
