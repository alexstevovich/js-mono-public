# @alexstevovich/common-ignore-patterns

A conservative list of common generated output, caches, editor state, and
operating-system metadata patterns.

```js
import commonIgnorePatterns from '@alexstevovich/common-ignore-patterns'
```

The list deliberately excludes source manifests, dependency lockfiles,
`Makefile`, `vendor/`, and other paths that may be essential project input.
The exported array is frozen.

This package is private until explicitly approved for publication.

## License

ISC. Copyright (c) 2025 Alex Stevovich.
