import assert from 'node:assert/strict'
import test from 'node:test'

import capProductVolume from '../src/index.js'

test('proportionally scales dimensions to the maximum volume', () => {
  const dimensions = capProductVolume([20, 10], 50)
  assert.ok(Math.abs(dimensions[0] * dimensions[1] - 50) < 1e-10)
  assert.equal(dimensions[0] / dimensions[1], 2)
})

test('returns a copy when the existing volume fits', () => {
  const input = [2, 3, 4]
  const output = capProductVolume(input, 24)
  assert.deepEqual(output, input)
  assert.notEqual(output, input)
})

test('rejects invalid dimensions and caps', () => {
  assert.throws(() => capProductVolume([], 1), /non-empty array/)
  assert.throws(() => capProductVolume([2, -1], 4), /non-negative/)
  assert.throws(() => capProductVolume([2, 2], 0), /positive finite/)
})
