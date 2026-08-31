import assert from 'node:assert/strict'
import test from 'node:test'

import bitEntropy from '../src/index.js'

test('calculates entropy from cardinality and length', () => {
  assert.equal(bitEntropy(2, 8), 8)
  assert.equal(bitEntropy(16, 32), 128)
  assert.equal(bitEntropy(1, 20), 0)
})

test('requires integer cardinality and length values', () => {
  assert.throws(() => bitEntropy(0, 1), /positive integer/)
  assert.throws(() => bitEntropy(2, -1), /non-negative integer/)
  assert.throws(() => bitEntropy(2.5, 4), /positive integer/)
})
