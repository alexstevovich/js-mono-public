# @alexstevovich/replace-string-map

Sequentially replace every occurrence of literal string keys using a value map.

```js
import replaceStringMap from '@alexstevovich/replace-string-map'

replaceStringMap('Hello, {{name}}.', { '{{name}}': 'Alex' })
```

Replacement order follows object entry order, which matters when keys overlap.
Values use the native `String.prototype.replaceAll` coercion behavior.

This package uses ECMAScript modules and is private until explicitly reviewed
for publication.

## License

Apache-2.0. Copyright 2025 Alex Stevovich.
