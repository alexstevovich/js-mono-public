# @alexstevovich/set-path-extension

Set or remove the final extension of a file path.

## API

`setPathExtension(filePath, extension)` accepts extensions with or without a
leading dot. Pass `null` or an empty string to remove the final extension.

## Installation

This package is private until it has been explicitly reviewed for publication.
Once published, install it with:

```sh
npm install @alexstevovich/set-path-extension
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

MIT. Copyright (c) 2016 Alex Stevovich
(https://alexstevovich.com).
