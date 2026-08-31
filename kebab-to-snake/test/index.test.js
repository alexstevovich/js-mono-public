import assert from 'node:assert/strict'
import test from 'node:test'

import kebabToSnake from '../src/index.js'

test('converts every hyphen to an underscore', () => {
  assert.equal(kebabToSnake('one-two-three'), 'one_two_three')
})

test('rejects non-string values', () => {
  assert.throws(() => kebabToSnake(null), /expects a string/)
})
