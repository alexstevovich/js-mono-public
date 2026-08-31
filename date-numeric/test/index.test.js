import assert from 'node:assert/strict'
import test from 'node:test'
import dateNumeric from '../src/index.js'

test('formats a numeric US date', () => {
  assert.equal(
    dateNumeric(new Date('2026-08-30T12:00:00Z'), { timeZone: 'UTC' }),
    '08/30/26',
  )
})

test('rejects invalid dates', () => {
  assert.throws(() => dateNumeric(new Date('invalid')), /valid Date/)
})
