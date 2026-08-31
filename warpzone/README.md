# @alexstevovich/warpzone

A compact facade for common filesystem operations.

```js
import warpzone from '@alexstevovich/warpzone'

await warpzone.write('./message.txt', 'hello')
const files = await warpzone.list('./content', { recursive: true })
const content = await warpzone.string('./content', { extensions: ['.md'] })
```

The historical `io8`, `lifi`, and `strdir` implementations are copied under
`src/vendor/`; Warpzone has no runtime package dependencies.

This package uses ECMAScript modules and is private until explicitly reviewed
for publication.

## License

MIT. Copyright (c) 2015 Alex Stevovich (https://alexstevovich.com).
