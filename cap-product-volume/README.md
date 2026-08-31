# @alexstevovich/cap-product-volume

Proportionally scale dimensions so their product does not exceed a maximum
volume.

```js
import capProductVolume from '@alexstevovich/cap-product-volume'

capProductVolume([20, 10], 50)
// approximately [10, 5]
```

Dimensions that already fit are returned unchanged in a new array. Dimensions
must be non-negative finite numbers, and the maximum volume must be positive
and finite.

This package uses ECMAScript modules and is private until explicitly reviewed
for publication.

## License

MIT. Copyright (c) 2026 Alex Stevovich (https://alexstevovich.com).
