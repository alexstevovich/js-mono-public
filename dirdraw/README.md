# @alexstevovich/dirdraw

Render a filesystem directory as a readable text tree.

```js
import dirdraw from '@alexstevovich/dirdraw'

console.log(await dirdraw('.', { depth: 2 }))
```

Use `createDirectoryTreeData()` when structured data is needed, or
`renderDirectoryTree()` to render compatible data separately. Ignore rules may
come from files such as `.gitignore` or from `globalIgnoreRules`.

## License

ISC. Copyright (c) 2025 Alex Stevovich.
