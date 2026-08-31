# @alexstevovich/create-tar-archive

Create a tar archive from selected filesystem paths.

```js
import createTarArchive from '@alexstevovich/create-tar-archive'

await createTarArchive(['src', 'package.json'], './release', {
  cwd: process.cwd(),
  compression: 'gzip',
})
```

Paths are interpreted relative to `cwd`. Compression may be `'gzip'`,
`'brotli'`, or `null`. The matching archive extension is appended by
default.

This package is private until explicitly approved for publication.

## License

ISC. Copyright (c) 2025 Alex Stevovich.
