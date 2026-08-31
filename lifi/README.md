# @alexstevovich/lifi

List files relative to a directory, optionally walking nested directories and
filtering by suffix.

```js
import listFiles, { listFilesSync } from '@alexstevovich/lifi'

const jsonFiles = await listFiles('./content', {
  recursive: true,
  extensions: ['.json'],
})

const topLevelFiles = listFilesSync('./content')
```

Results are deterministic, directories and symbolic links are excluded, and
extension matching is case-sensitive. Traversal is non-recursive by default.

Lifi is a convenience facade over package-local copies of the independent
`list-files` and `list-files-sync` atoms. It has no runtime dependency on those
packages.

This package uses ECMAScript modules and is private until explicitly reviewed
for publication.

## License

MIT. Copyright (c) 2015 Alex Stevovich (https://alexstevovich.com).
