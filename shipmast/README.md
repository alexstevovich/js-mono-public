# @alexstevovich/shipmast

Apply, update, and remove templated Shipmast metadata headers in C-style source
files.

```js
import { applyShipmast, removeShipmast } from '@alexstevovich/shipmast'

const result = applyShipmast(source, template, {
  data: { package_name: 'example' },
  filePath: '/project/src/index.js',
  rootDirectory: '/project',
})
```

Shipmast headers use the marked `/*˹ … ˼*/` block. Templates accept both
`{{name}}` and the historical `{{$name}}` placeholder form. Built-in values
include the relative file path, byte size, UUID, generation time, source hash,
template hash, year, and generator name.

Existing UUIDs and user metadata are retained when possible. An unchanged
source and template return the original document byte-for-byte. Shebangs,
leading comments, code, and trailing comments are preserved.

The recent C-style partition and UUID-validation helpers are copied under
`src/vendor/`. This package has no runtime dependencies.

This package is private until explicitly approved for publication.

## License

Apache-2.0. Copyright 2022 Alex Stevovich.
