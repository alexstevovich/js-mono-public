# @alexstevovich/filter-paths-by-glob

Filter original path strings against Micromatch globs evaluated relative to a
base directory.

```js
import filterPathsByGlob from '@alexstevovich/filter-paths-by-glob'

filterPathsByGlob('/project', files, ['src/**/*.js', '!**/*.test.js'])
```

Absolute and relative inputs may be mixed, original path strings are preserved,
and dotfiles are included by default. The tiny path-separator normalizer is
copied locally under `src/vendor/`; Micromatch remains a declared dependency
because its matching semantics are substantial.

This package uses ECMAScript modules and is private until explicitly reviewed
for publication.

## License

ISC. Copyright (c) 2025 Alex Stevovich.
