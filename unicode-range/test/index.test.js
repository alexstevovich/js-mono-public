import assert from 'node:assert/strict'
import test from 'node:test'
import unicodeRange from '../src/index.js'

test('creates inclusive BMP and supplementary ranges', () => {
  assert.equal(unicodeRange(0x41, 0x44), 'ABCD')
  assert.equal(unicodeRange(0x1f600, 0x1f602), '😀😁😂')
  assert.equal(unicodeRange(3, 2), '')
})

test('validates code points', () => {
  assert.throws(() => unicodeRange(-1, 2), RangeError)
  assert.throws(() => unicodeRange(1.5, 2), TypeError)
})
