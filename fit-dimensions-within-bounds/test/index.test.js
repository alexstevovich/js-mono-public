import assert from 'node:assert/strict'
import test from 'node:test'
import fitDimensionsWithinBounds from '../src/index.js'

test('scales proportionally to the tightest bound', () => {
  assert.deepEqual(fitDimensionsWithinBounds([400, 200], [100, 100]), [100, 50])
  assert.deepEqual(fitDimensionsWithinBounds([20, 10], [100, 100]), [100, 50])
})

test('validates dimensions and arity', () => {
  assert.throws(() => fitDimensionsWithinBounds([1], [1, 2]), /same length/)
  assert.throws(() => fitDimensionsWithinBounds([0], [1]), /positive/)
})
