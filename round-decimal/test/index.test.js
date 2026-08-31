import assert from 'node:assert/strict'
import test from 'node:test'
import roundDecimal from '../src/index.js'

test('rounds positive and negative decimal places', () => {
  assert.equal(roundDecimal(1.005, 2), 1.01)
  assert.equal(roundDecimal(1499, -2), 1500)
})

test('requires finite values and integer places', () => {
  assert.throws(() => roundDecimal(Infinity), /finite/)
  assert.throws(() => roundDecimal(1, 1.5), /integer/)
})
