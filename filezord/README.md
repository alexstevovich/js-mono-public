# @alexstevovich/filezord

Combine UTF-8 files into a standardized Filezord text document for
communication and review.

```js
import filezord from '@alexstevovich/filezord'

const document = await filezord(files, {
  id: 'package-review',
  rootDirectory: process.cwd(),
})
```

The document begins with a Filezord summary and places a standardized header
before every file. Templates can be replaced through `headerTemplate` and
`fileHeaderTemplate`. Supported placeholders are `{generatedOn}`, `{root}`,
`{fileCount}`, `{id}`, and `{file}`.

Unreadable inputs remain represented by labeled error text instead of aborting
the entire document.

This package is private until explicitly approved for publication.

## License

Apache-2.0. Copyright 2022 Alex Stevovich.
