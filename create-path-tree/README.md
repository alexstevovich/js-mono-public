# @alexstevovich/create-path-tree

Create a traversable tree model of a filesystem path.

```js
import createPathTree from '@alexstevovich/create-path-tree'

const root = await createPathTree('.', {
  ignoreRuleFiles: ['.gitignore'],
})

for (const node of root.flatten()) {
  console.log(node.relativePath(), node.type, node.ignored)
}
```

`depth` limits directory traversal, with the root at depth `0`. The legacy
`recursive` boolean is also accepted when `depth` is omitted. Symbolic links
are represented but never traversed.

Each node exposes its absolute `path`, `name`, `type`, `parent`, `children`,
filesystem `stats`, and `ignored` state. It also provides `isDirectory()`,
`isFile()`, `isSymbolicLink()`, `flatten()`, `walk()`, `relativePath()`, and
`getTotalBytes()`.

Ignore behavior supports rule files discovered throughout the tree and optional
root-level rules. The owned matching implementation is copied locally under
`src/vendor/`; `minimatch` remains a third-party dependency.

## Development

```sh
npm install
npm test
npm run lint
npm run format:check
```

## License

ISC. Copyright (c) 2025 Alex Stevovich.
