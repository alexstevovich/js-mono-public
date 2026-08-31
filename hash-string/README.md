# @alexstevovich/hash-string

Create a hexadecimal cryptographic hash of a string.

## API

`hashString(input, algorithm = 'sha256')` returns a hexadecimal digest using a
hash algorithm supported by Node.js.

## Installation

This package is private until it has been explicitly reviewed for publication.
Once published, install it with:

```sh
npm install @alexstevovich/hash-string
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

MIT. Copyright (c) 2018 Alex Stevovich
(https://alexstevovich.com).
