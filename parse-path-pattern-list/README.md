# @alexstevovich/parse-path-pattern-list

Parse newline-delimited path patterns while ignoring blank lines and lines that
begin with `#` after trimming.

```js
import parsePathPatternList from '@alexstevovich/parse-path-pattern-list'

parsePathPatternList('# comment\nsrc/**\n!src/tmp/**')
// ['src/**', '!src/tmp/**']
```

This package uses ECMAScript modules and is private until explicitly reviewed
for publication.

## License

ISC. Copyright (c) 2025 Alex Stevovich.
