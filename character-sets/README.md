# @alexstevovich/character-sets

Reusable ASCII and Unicode character collections in one package.

```js
import getCharacterSet, {
  asciiAlphanumeric,
  getHangulSyllables,
  kana,
} from '@alexstevovich/character-sets'

getCharacterSet('emoji')
getHangulSyllables()
console.log(asciiAlphanumeric, kana)
```

Small ASCII and kana collections are exported as strings. Larger collections
are created lazily and cached by `getHangulSyllables()`,
`getChineseCharacterSet()`, `getKanjiCharacterSet()`, and
`getEmojiCharacterSet()`.

`getCharacterSet(name)` provides one uniform lookup API. Supported names are
available as `characterSetNames`.

The emoji collection preserves the historical range-based behavior while
removing duplicate code points. It is a practical collection of emoji-related
symbols, not the Unicode Consortium's complete emoji-sequence dataset.

This package is private until explicitly approved for publication.

## License

ISC. Copyright (c) 2025 Alex Stevovich.
