# poshify

Sort `package.json` keys into a consistent, readable order.

```sh
npm install --save-dev poshify
npx poshify
npx poshify ./another-project
```

The JavaScript API mutates and returns the supplied package object:

```js
import { sort } from 'poshify'

sort(packageData)
```

## License

Apache-2.0. Copyright 2018-2025 Alex Stevovich.
