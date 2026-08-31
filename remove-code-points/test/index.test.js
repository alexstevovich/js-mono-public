import assert from 'node:assert/strict'
import test from 'node:test'
import removeCodePoints from '../src/index.js'

test('removes selected code points while retaining order', () => {
  assert.equal(removeCodePoints('a😀b😀c', '😀b'), 'ac')
  assert.equal(removeCodePoints('aabbcc', 'b'), 'aacc')
})

test('requires strings', () => {
  assert.throws(() => removeCodePoints(null, ''), /strings/)
})
