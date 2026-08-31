import assert from 'node:assert/strict'
import test from 'node:test'
import scaleDimensionsToAxis from '../src/index.js'

test('sets one axis while maintaining proportions', () => {
  assert.deepEqual(scaleDimensionsToAxis([400, 200], 1, 100), [200, 100])
})

test('validates the selected axis', () => {
  assert.throws(() => scaleDimensionsToAxis([1, 2], 2, 3), /axis/)
})
