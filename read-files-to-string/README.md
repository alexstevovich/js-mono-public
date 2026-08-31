# @alexstevovich/read-files-to-string

Read an ordered list of files into one string.

## API

`await readFilesToString(paths, options)` preserves input order in sequential
and parallel modes. `delimiter` may contain `{{PATH}}` and `{{PATH_ABS}}`.

## Installation

This package is private until it has been explicitly reviewed for publication.
Once published, install it with:

```sh
npm install @alexstevovich/read-files-to-string
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
