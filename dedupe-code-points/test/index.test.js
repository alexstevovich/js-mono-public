import assert from 'node:assert/strict'
import test from 'node:test'

import dedupeCodePoints from '../src/index.js'

test('removes repeated code points while preserving first appearance', () => {
  assert.equal(dedupeCodePoints('cbacdcbc'), 'cbad')
  assert.equal(dedupeCodePoints('🙂🙃🙂'), '🙂🙃')
})

test('treats the code points inside grapheme clusters independently', () => {
  assert.equal(dedupeCodePoints('e\u0301e\u0301'), 'e\u0301')

  const family = '👨‍👩‍👧‍👦'
  assert.notEqual(dedupeCodePoints(`${family}${family}`), family)
})

test('requires a string', () => {
  assert.throws(() => dedupeCodePoints(null), /input must be a string/)
})
