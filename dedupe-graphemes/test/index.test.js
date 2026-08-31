import assert from 'node:assert/strict'
import test from 'node:test'

import dedupeGraphemes from '../src/index.js'

test('removes repeated graphemes while preserving first appearance', () => {
  assert.equal(dedupeGraphemes('cbacdcbc'), 'cbad')
  assert.equal(dedupeGraphemes('あいあいうえおお'), 'あいうえお')
})

test('treats multi-codepoint grapheme clusters as units', () => {
  const family = '👨‍👩‍👧‍👦'
  assert.equal(dedupeGraphemes(`${family}${family}🙂🙂`), `${family}🙂`)
})

test('requires a string', () => {
  assert.throws(() => dedupeGraphemes(null), /input must be a string/)
})
