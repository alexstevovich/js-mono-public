# @alexstevovich/parse-path-ignore-rule

Interpret one Git-style path-ignore rule into its normalized pattern and flags.

```js
import parsePathIgnoreRule from '@alexstevovich/parse-path-ignore-rule'

parsePathIgnoreRule('!/cache/')
// { pattern: 'cache', isNegated: true, anchored: true, directoryOnly: true, ... }
```

This package uses ECMAScript modules and is private until explicitly reviewed
for publication.

## License

ISC. Copyright (c) 2025 Alex Stevovich.
