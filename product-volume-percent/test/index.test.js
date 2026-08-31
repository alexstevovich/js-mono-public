import assert from 'node:assert/strict'
import test from 'node:test'
import productVolumePercent from '../src/index.js'

test('compares products as a percentage', () => {
  assert.equal(productVolumePercent([5, 10], [10, 10]), 50)
  assert.equal(productVolumePercent([0, 10], [0, 20]), 0)
  assert.equal(productVolumePercent([1, 10], [0, 20]), Infinity)
})

test('requires equal dimensionality', () => {
  assert.throws(() => productVolumePercent([1], [1, 2]), /same length/)
})
