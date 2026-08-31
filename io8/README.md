# @alexstevovich/io8

Read, write, and copy files with concise APIs and UTF-8 text defaults.

```js
import io8 from '@alexstevovich/io8'

await io8.write('./message.txt', 'Hello world')
const message = await io8.read('./message.txt')
await io8.copy('./message.txt', './message-copy.txt')
```

Named synchronous exports are also available: `readSync`, `writeSync`, and
`copySync`. Pass any options accepted by the corresponding `node:fs` method.
Copying delegates directly to `copyFile`, so binary content is preserved.

This package uses ECMAScript modules and is private until explicitly reviewed
for publication.

## License

MIT. Copyright (c) 2015 Alex Stevovich (https://alexstevovich.com).
