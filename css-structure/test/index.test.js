import assert from 'node:assert/strict'
import test from 'node:test'

import { parseCss, serializeCss } from '../src/index.js'

test('parses and serializes nested CSS rules', () => {
  const source = 'div { color: blue; div p { margin: 10px; } }'
  const structure = parseCss(source)
  assert.deepEqual(structure.rules[0].declarations, [
    { property: 'color', value: 'blue' },
  ])
  assert.equal(structure.rules[0].rules[0].selectors[0], 'div p')
  assert.equal(serializeCss(structure), 'div{color:blue;div p{margin:10px;}}')
})

test('optionally retains comments', () => {
  const structure = parseCss('/* note */ p { color: red; }', {
    comments: true,
  })
  assert.deepEqual(structure.comments, ['/* note */'])
})
