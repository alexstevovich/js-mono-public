# @alexstevovich/partition-c-style-source

Partition C-style source into its shebang, leading non-code material, primary
code region, and trailing non-code material without changing the source.

## API

`partitionCStyleSource(content)` returns:

```js
{
  shebang,
  header,
  body,
  footer,
}
```

Concatenating the four values reproduces the original input. If the input has
no code, all content after the shebang is returned as `header`.

## Installation

This package is private until it has been explicitly reviewed for publication.
Once published, install it with:

```sh
npm install @alexstevovich/partition-c-style-source
```

## Development

```sh
npm install
npm run lint
npm run format:check
npm test
```

The package uses ECMAScript modules. Its public entry point is `src/index.js`.

## License

MIT. Copyright (c) 2025 Alex Stevovich
(https://alexstevovich.com).
