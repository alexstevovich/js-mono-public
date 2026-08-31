import assert from 'node:assert/strict'
import test from 'node:test'
import randomGraphemes from '../src/index.js'

test('selects complete grapheme clusters', () => {
  const result = randomGraphemes('a👨‍👩‍👧‍👦', 10)
  const segments = [
    ...new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(
      result,
    ),
  ]
  assert.equal(segments.length, 10)
  assert.ok(
    segments.every(({ segment }) => segment === 'a' || segment === '👨‍👩‍👧‍👦'),
  )
})

test('supports zero length', () => {
  assert.equal(randomGraphemes('a', 0), '')
})
