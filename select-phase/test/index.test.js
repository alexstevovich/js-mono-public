import assert from 'node:assert/strict'
import test from 'node:test'

import selectPhase from '../src/index.js'

const starts = [4 / 24, 17 / 24, 21 / 24]

test('selects phases from their normalized start positions', () => {
  assert.equal(selectPhase(starts, 6 / 24), 0)
  assert.equal(selectPhase(starts, 18 / 24), 1)
  assert.equal(selectPhase(starts, 22 / 24), 2)
})

test('can wrap before the first phase or return no selection', () => {
  assert.equal(selectPhase(starts, 2 / 24), 2)
  assert.equal(selectPhase(starts, 2 / 24, { cyclic: false }), -1)
})

test('uses exact boundaries as the start of the next phase', () => {
  assert.equal(selectPhase(starts, 4 / 24), 0)
  assert.equal(selectPhase(starts, 17 / 24), 1)
  assert.equal(selectPhase(starts, 21 / 24), 2)
})

test('validates normalized positions and ordered starts', () => {
  assert.throws(() => selectPhase([0.5, 0.25], 0.4), RangeError)
  assert.throws(() => selectPhase([0.25], 2), RangeError)
  assert.throws(() => selectPhase([], 0.5), TypeError)
})
