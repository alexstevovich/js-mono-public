# @alexstevovich/xml-to-tree

Parse XML documents or multi-root fragments into JSON-compatible trees.

```js
import xmlToTree from '@alexstevovich/xml-to-tree'

xmlToTree('<book id="one"><title>Example</title></book>')
```

Elements contain `tag` and `children`; attributes are copied onto the element,
and text and CDATA become child nodes. The key names are configurable.
`@xmldom/xmldom` provides XML parsing.

This package uses ECMAScript modules and is private until explicitly reviewed
for publication.

## License

MIT. Copyright (c) 2016 Alex Stevovich (https://alexstevovich.com).
