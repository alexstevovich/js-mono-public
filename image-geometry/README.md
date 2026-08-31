# @alexstevovich/image-geometry

Read consistent geometry metadata from raster and SVG image files or directory
trees.

## API

The main entry point exports all six operations:

```js
import scanImageGeometry, {
  readImageGeometry,
  readRasterGeometry,
  readSvgGeometry,
  scanRasterGeometry,
  scanSvgGeometry,
} from '@alexstevovich/image-geometry'
```

Single-file readers return one metadata object:

```js
const geometry = await readImageGeometry('./images/hero.png')
```

Directory scanners always return arrays in deterministic relative-path order:

```js
const images = await scanImageGeometry('./images', {
  recursive: true,
  includeRaster: true,
  includeSvg: true,
  onError: 'skip',
})
```

Each result contains `path`, `width`, `height`, `aspectRatio`, `orientation`,
`format`, and `filesize`. SVG dimensions support numeric `width` and `height`
attributes, `px` units, and `viewBox` fallback.

The raster, SVG, and unified layers can also be imported independently:

```js
import {
  readRasterGeometry,
  scanRasterGeometry,
} from '@alexstevovich/image-geometry/raster'

import {
  readSvgGeometry,
  scanSvgGeometry,
} from '@alexstevovich/image-geometry/svg'
```

Directory scans skip unreadable or unsupported matching files by default. Set
`onError: 'throw'` when any matching-file failure should abort the scan.

## Installation

This package is private until explicitly reviewed for publication. Once
published, install it with:

```sh
npm install @alexstevovich/image-geometry
```

## License

MIT. Copyright (c) 2019 Alex Stevovich (https://alexstevovich.com).
