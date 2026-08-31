# @alexstevovich/prose-list

Format values as a natural-language prose list.

```js
import formatProseList from '@alexstevovich/prose-list'

formatProseList(['apples', 'bananas', 'cherries'])
// "apples, bananas, and cherries"

formatProseList(['red', 'blue', 'green'], {
  conjunction: 'or',
  oxford: false,
})
// "red, blue or green"
```

Input values are converted to strings without mutating the input array.

This package uses ECMAScript modules and is private until explicitly reviewed
for publication.

## License

MIT. Copyright (c) 2015 Alex Stevovich (https://alexstevovich.com).
