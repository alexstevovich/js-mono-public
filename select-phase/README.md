# @alexstevovich/select-phase

Select a phase index from strictly increasing start positions between `0` and
`1`.

```js
import selectPhase from '@alexstevovich/select-phase'

const starts = [4 / 24, 17 / 24, 21 / 24]
const labels = ['day', 'evening', 'night']
const label = labels[selectPhase(starts, position)]
```

The selected phase is the latest start at or before the position. When the
position precedes the first start, cyclic selection returns the final phase;
`{ cyclic: false }` returns `-1` instead.

The selector returns only an index. Labels, greetings, colors, actions, and
other meanings remain entirely external.

This package is private until explicitly approved for publication.

## License

Apache-2.0. Copyright 2015 Alex Stevovich.
