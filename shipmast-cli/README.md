# @alexstevovich/shipmast-cli

Apply, update, or remove Shipmast headers from files selected by globs.

```sh
shipmast "src/**/*.js"
shipmast --remove "src/**/*.js"
shipmast "src/**/*.js" --template ./.shipmast --data '{"purpose":"Core API"}'
shipmast "src/**/*.js" --dry-run
```

The CLI delegates all document behavior to `@alexstevovich/shipmast` and uses
the third-party `glob` package for file selection.

The package reserves the `shipmast` executable name but is not installed or
linked as a CLI by this repository workflow. It remains private until explicitly
approved for publication.

## License

Apache-2.0. Copyright 2022 Alex Stevovich.
