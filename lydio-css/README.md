# @alexstevovich/lydio-css

Programmatically compose CSS properties, variables, rules, and sheets.

```js
import { Sheet } from '@alexstevovich/lydio-css'

const sheet = new Sheet()
sheet.addRule('.button').chainProp('color', 'navy').chainVar('gap', '1rem')
console.log(sheet.toCss())
```

This package is standalone and does not depend on Lydio core. It uses ECMAScript
modules and is private until explicitly reviewed for publication.

## License

ISC. Copyright (c) 2025 Alex Stevovich.
