# @alexstevovich/list-npm-package-files

List the files npm would include in a package archive.

```js
import listNpmPackageFiles from '@alexstevovich/list-npm-package-files'

const files = await listNpmPackageFiles('./package')
```

The function uses `npm pack --dry-run --json --ignore-scripts`, so it does not
create or delete a package archive. npm must be available on `PATH`.

This package is private until explicitly approved for publication.

## License

ISC. Copyright (c) 2025 Alex Stevovich.
