# @alexstevovich/normalize-phase

Normalize a value from any numeric interval to a phase position from `0` to
`1`.

```js
import normalizePhase from '@alexstevovich/normalize-phase'

const position = normalizePhase(hour, {
  minimum: 0,
  maximum: 24,
  cyclic: true,
})
```

Non-cyclic intervals include both endpoints, so the maximum maps to `1`.
Cyclic intervals wrap at the maximum, so the maximum maps back to `0`.
Values outside a cyclic interval wrap in either direction.

This package contains no time-of-day labels or presentation text. Those belong
to the consuming application.

This package is private until explicitly approved for publication.

## License

Apache-2.0. Copyright 2015 Alex Stevovich.
