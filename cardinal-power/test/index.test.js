import assert from 'node:assert/strict'
import test from 'node:test'

import cardinalPower from '../src/index.js'

test('calculates symbol-space cardinality exactly', () => {
  assert.equal(cardinalPower(62, 10), 839299365868340224n)
  assert.equal(
    cardinalPower(2n, 128n),
    340282366920938463463374607431768211456n,
  )
  assert.equal(cardinalPower(10, 0), 1n)
})

test('rejects invalid values', () => {
  assert.throws(() => cardinalPower(0, 2), /positive integer/)
  assert.throws(() => cardinalPower(2, -1), /non-negative integer/)
  assert.throws(() => cardinalPower(2.5, 3), /safe integer/)
})
