# @alexstevovich/create-path-ignore-matcher

Create a reusable matcher from a static list of Git-style path-ignore rules.

```js
import createPathIgnoreMatcher from '@alexstevovich/create-path-ignore-matcher'

const isIgnored = createPathIgnoreMatcher(['*.log', '!logs/keep.log'])
isIgnored('logs/error.log', false) // true
```

The rule interpreter and path normalizer are package-local copies under
`src/vendor/`. Minimatch remains an external dependency.

This package uses ECMAScript modules and is private until explicitly reviewed
for publication.

## License

ISC. Copyright (c) 2025 Alex Stevovich.
