# @alexstevovich/path-to-posix

Convert backslash path separators to POSIX forward slashes independently of the
host operating system.

```js
import pathToPosix from '@alexstevovich/path-to-posix'

pathToPosix('C:\\work\\src\\index.js') // "C:/work/src/index.js"
pathToPosix('\\\\server\\share') // "//server/share"
```

Existing forward slashes and other path content are preserved.

This package uses ECMAScript modules and is private until explicitly reviewed
for publication.

## License

MIT. Copyright (c) 2026 Alex Stevovich (https://alexstevovich.com).
