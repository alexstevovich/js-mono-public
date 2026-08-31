# @alexstevovich/dedupe-code-points

Remove duplicate Unicode code points while preserving their first-seen order.

```js
import dedupeCodePoints from '@alexstevovich/dedupe-code-points'

dedupeCodePoints('cbacdcbc') // 'cbad'
dedupeCodePoints('🙂🙃🙂') // '🙂🙃'
```

This package intentionally operates on Unicode code points through JavaScript
string iteration. It is useful for canonicalizing symbol alphabets and other
cases where code points—not user-perceived grapheme clusters—are the units.
Use `@alexstevovich/dedupe-graphemes` when complete grapheme clusters must stay
together.

This package uses ECMAScript modules and is private until explicitly reviewed
for publication.

## License

MIT. Copyright (c) 2015 Alex Stevovich (https://alexstevovich.com).
