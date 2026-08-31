# @alexstevovich/bit-entropy

Calculate the entropy of a fixed-length symbol space in bits.

```js
import bitEntropy from '@alexstevovich/bit-entropy'

bitEntropy(2, 8) // 8
bitEntropy(16, 32) // 128
bitEntropy(62, 10) // approximately 59.54
```

`cardinality` must be a positive integer and `length` must be a non-negative
integer. A cardinality of one has zero entropy.

This package uses ECMAScript modules and is private until explicitly reviewed
for publication.

## License

MIT. Copyright (c) 2026 Alex Stevovich (https://alexstevovich.com).
