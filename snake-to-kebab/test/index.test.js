import assert from 'node:assert/strict'
import test from 'node:test'

import snakeToKebab from '../src/index.js'

test('converts every underscore to a hyphen', () => {
  assert.equal(snakeToKebab('one_two_three'), 'one-two-three')
})

test('rejects non-string values', () => {
  assert.throws(() => snakeToKebab(null), /expects a string/)
})
