# @alexstevovich/cardinal-power

Calculate the exact number of values in a fixed-length symbol space.

```js
import cardinalPower from '@alexstevovich/cardinal-power'

cardinalPower(62, 10) // 839299365868340224n
cardinalPower(2n, 128n) // exact BigInt result
```

The result is always a `bigint`. Inputs may be safe integers or `bigint`
values. Cardinality must be positive and length must be non-negative.

This package uses ECMAScript modules and is private until explicitly reviewed
for publication.

## License

MIT. Copyright (c) 2026 Alex Stevovich (https://alexstevovich.com).
