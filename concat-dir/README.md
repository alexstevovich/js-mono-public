# @alexstevovich/concat-dir

Concatenate files from a directory in deterministic name order.

```js
import concatDir, { concatDirSync } from '@alexstevovich/concat-dir'

const source = await concatDir('./content', {
  extensions: ['.md'],
  recursive: true,
  separator: '\n',
})

const sourceSync = concatDirSync('./content', { extensions: ['.md'] })
```

Traversal is recursive by default. File whitespace is preserved, symbolic links
are not followed, and extension matching is case-insensitive.

This package uses ECMAScript modules and is private until explicitly reviewed
for publication.

## License

MIT. Copyright (c) 2015 Alex Stevovich (https://alexstevovich.com).
