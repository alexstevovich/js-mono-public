# @alexstevovich/list-tar-entries

List paths stored in a tar, gzip-compressed tar, or Brotli-compressed tar
archive.

```js
import listTarEntries from '@alexstevovich/list-tar-entries'

const entries = await listTarEntries('./release.tar.gz')
```

Compression is detected from the `.gz`, `.tgz`, or `.br` extension.

This package is private until explicitly approved for publication.

## License

Apache-2.0. Copyright 2016 Alex Stevovich.
