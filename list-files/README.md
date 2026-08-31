# @alexstevovich/list-files

List file paths relative to a directory asynchronously.

```js
import listFiles from '@alexstevovich/list-files'

const files = await listFiles('./content', {
  recursive: true,
  extensions: ['.json'],
})
```

Results are deterministic, directories and symbolic links are excluded, and
extension matching is case-sensitive. Traversal is non-recursive by default.

This package uses ECMAScript modules and is private until explicitly reviewed
for publication.

## License

MIT. Copyright (c) 2015 Alex Stevovich (https://alexstevovich.com).
