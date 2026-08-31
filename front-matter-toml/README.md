# @alexstevovich/front-matter-toml

Parse, serialize, and validate TOML front matter delimited by `+++`.

```js
import { parse, serialize, validate } from '@alexstevovich/front-matter-toml'

const { data, content } = parse(document)
const output = serialize(data, content)
validate(output)
```

TOML syntax is provided by `@iarna/toml`. This package uses ECMAScript
modules and is private until explicitly reviewed for publication.

## License

Apache-2.0. Copyright 2014 Alex Stevovich.
