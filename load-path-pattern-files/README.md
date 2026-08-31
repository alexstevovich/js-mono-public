# @alexstevovich/load-path-pattern-files

Load and combine newline-delimited path-pattern files from one directory.
Missing or unreadable files are ignored because the inputs are optional.

```js
import loadPathPatternFiles from '@alexstevovich/load-path-pattern-files'

const patterns = await loadPathPatternFiles('./config', [
  'include.patterns',
  'exclude.patterns',
])
```

The small pattern-list parser is copied locally under `src/vendor/`; this
package has no runtime dependency on another internal utility package.

This package uses ECMAScript modules and is private until explicitly reviewed
for publication.

## License

ISC. Copyright (c) 2025 Alex Stevovich.
