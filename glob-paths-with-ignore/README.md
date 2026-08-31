# @alexstevovich/glob-paths-with-ignore

Find paths matching one or more globs while applying hierarchical ignore rules.

```js
import globPathsWithIgnore from '@alexstevovich/glob-paths-with-ignore'

const files = await globPathsWithIgnore('./project', '**/*.js', {
  ignoreRuleFiles: ['.gitignore'],
})
```

The complete internal scanner and helper chain is copied under `src/vendor/`.
Minimatch and Micromatch remain external dependencies because their matching
semantics are maintained upstream.

This package uses ECMAScript modules and is private until explicitly reviewed
for publication.

## License

ISC. Copyright (c) 2025 Alex Stevovich.
