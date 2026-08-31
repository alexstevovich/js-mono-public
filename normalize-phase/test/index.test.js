import assert from 'node:assert/strict'
import test from 'node:test'

import normalizePhase from '../src/index.js'

test('normalizes values from an arbitrary interval', () => {
  assert.equal(normalizePhase(0), 0)
  assert.equal(normalizePhase(12, { minimum: 0, maximum: 24 }), 0.5)
  assert.equal(normalizePhase(24, { minimum: 0, maximum: 24 }), 1)
})

test('wraps values when the interval is cyclic', () => {
  assert.equal(normalizePhase(24, { minimum: 0, maximum: 24, cyclic: true }), 0)
  assert.equal(
    normalizePhase(27, { minimum: 0, maximum: 24, cyclic: true }),
    0.125,
  )
  assert.equal(
    normalizePhase(-6, { minimum: 0, maximum: 24, cyclic: true }),
    0.75,
  )
})

test('validates intervals and non-cyclic values', () => {
  assert.throws(() => normalizePhase(25, { maximum: 24 }), RangeError)
  assert.throws(() => normalizePhase(0, { minimum: 1, maximum: 1 }), RangeError)
  assert.throws(() => normalizePhase(Number.NaN), TypeError)
})
