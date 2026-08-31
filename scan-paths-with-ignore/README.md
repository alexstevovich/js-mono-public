# @alexstevovich/scan-paths-with-ignore

Scan a directory while applying hierarchical ignore-rule files and optional
global rules.

```js
import scanPathsWithIgnore from '@alexstevovich/scan-paths-with-ignore'

const files = await scanPathsWithIgnore('./project', {
  ignoreRuleFiles: ['.gitignore'],
  pathTypes: 'FILE',
  recursive: true,
})
```

The complete internal ignore-matcher chain is copied under `src/vendor/`.
Minimatch remains an external dependency.

This package uses ECMAScript modules and is private until explicitly reviewed
for publication.

## License

ISC. Copyright (c) 2025 Alex Stevovich.
