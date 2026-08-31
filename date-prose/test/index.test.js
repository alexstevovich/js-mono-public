import assert from 'node:assert/strict'
import test from 'node:test'
import dateProse from '../src/index.js'

test('formats a prose US date', () => {
  assert.equal(
    dateProse(new Date('2026-08-30T12:00:00Z'), { timeZone: 'UTC' }),
    'August 30, 2026',
  )
})

test('rejects invalid dates', () => {
  assert.throws(() => dateProse(null), /valid Date/)
})
