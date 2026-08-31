# @alexstevovich/dedupe-graphemes

Remove repeated grapheme clusters from a string while preserving the order of
their first appearance.

```js
import dedupeGraphemes from '@alexstevovich/dedupe-graphemes'

dedupeGraphemes('a🙂b🙂a') // "a🙂b"
dedupeGraphemes('👨‍👩‍👧‍👦👨‍👩‍👧‍👦') // "👨‍👩‍👧‍👦"
```

Unlike code-unit or code-point deduplication, this package uses
`Intl.Segmenter` so combined emoji and other multi-codepoint user-perceived
characters remain intact.

Use `@alexstevovich/dedupe-code-points` when each Unicode code point is an
intentional symbol, such as when canonicalizing an entropy alphabet.

This package uses ECMAScript modules and is private until explicitly reviewed
for publication.

## License

MIT. Copyright (c) 2015 Alex Stevovich (https://alexstevovich.com).
