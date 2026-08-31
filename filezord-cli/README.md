# @alexstevovich/filezord-cli

Generate a `.filezord` document from the current working directory.

The package reserves the `filezord` executable name:

```sh
filezord
```

It scans files recursively, respects hierarchical `.gitignore` files, excludes
common generated and local artifacts, and delegates document generation to
`@alexstevovich/filezord`.

The walking and ignore implementation is copied locally under `src/vendor/`.
Only `filezord` and the third-party matcher dependency remain declared runtime
dependencies.

This package is not installed or linked as a CLI by the repository workflow. It
is private until explicitly approved for publication.

## License

ISC. Copyright (c) 2025 Alex Stevovich.
