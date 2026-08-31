# @alexstevovich/css-structure

Parse CSS into a structured representation and serialize that representation
back to compact CSS.

```js
import { parseCss, serializeCss } from '@alexstevovich/css-structure'

const structure = parseCss('div { color: blue; }')
serializeCss(structure) // 'div{color:blue;}'
```

The representation contains nested `rules`, selector arrays, and declaration
objects. Parsing can optionally retain comments.

This package uses ECMAScript modules and is private until explicitly reviewed
for publication.

## License

Apache-2.0. Copyright 2024 Alex Stevovich.
