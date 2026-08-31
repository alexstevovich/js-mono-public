# @alexstevovich/create-scoped-path-ignore-matcher

Build a hierarchical matcher from ignore-rule files found throughout a
directory tree.

```js
import createScopedPathIgnoreMatcher from '@alexstevovich/create-scoped-path-ignore-matcher'

const isIgnored = await createScopedPathIgnoreMatcher('./project', {
  pathexFiles: ['.gitignore'],
  globalPathexRules: ['dist/'],
})
```

Historical internal helpers are copied under `src/vendor/`. Minimatch is the
only runtime package dependency.

This package uses ECMAScript modules and is private until explicitly reviewed
for publication.

## License

ISC. Copyright (c) 2025 Alex Stevovich.
