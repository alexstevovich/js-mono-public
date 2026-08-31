# @alexstevovich/front-matter-json

Parse, serialize, and validate JSON front matter delimited by `---`.

```js
import { parse, serialize, validate } from '@alexstevovich/front-matter-json'

const { data, content } = parse(document)
const output = serialize(data, content)
validate(output)
```

This package uses ECMAScript modules and is private until explicitly reviewed
for publication.

## License

Apache-2.0. Copyright 2014 Alex Stevovich.
