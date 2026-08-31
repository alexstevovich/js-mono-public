# @alexstevovich/is-valid-uuid

Validate canonical RFC 9562 UUID strings, including versions 1 through 8.

```js
import isValidUuid from '@alexstevovich/is-valid-uuid'

isValidUuid('550e8400-e29b-41d4-a716-446655440000') // true
isValidUuid('550e8400-e29b-41d4-a716-446655440000', { version: 4 }) // true
isValidUuid('550E8400-E29B-41D4-A716-446655440000', {
  strictCase: true,
}) // false
```

Uppercase and mixed-case hexadecimal are accepted by default as required by
the UUID textual format. `strictCase: true` restricts input to lowercase. Nil,
Max, non-standard variants, and malformed values are rejected.

This package uses ECMAScript modules and is private until explicitly reviewed
for publication.

## License

MIT. Copyright (c) 2023 Alex Stevovich (https://alexstevovich.com).
