# @alexstevovich/front-matter-yaml

Parse, serialize, and validate YAML front matter delimited by `---`.

```js
import { parse, serialize, validate } from '@alexstevovich/front-matter-yaml'

const { data, content } = parse(document)
const output = serialize(data, content)
validate(output)
```

YAML syntax is provided by `js-yaml`. This package uses ECMAScript modules
and is private until explicitly reviewed for publication.

## License

Apache-2.0. Copyright 2014 Alex Stevovich.
