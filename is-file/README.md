# @alexstevovich/is-file

Check asynchronously whether a path identifies a file.

## API

`await isFile(filePath)` returns `true` only when the accessible path resolves
to a file. Directories, missing paths, and inaccessible paths return `false`.

## Installation

This package is private until it has been explicitly reviewed for publication.
Once published, install it with:

```sh
npm install @alexstevovich/is-file
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
