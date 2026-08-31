import assert from 'node:assert/strict'
import test from 'node:test'
import dailyShuffle from '../src/index.js'

test('is stable for a UTC date without mutating input', () => {
  const input = [1, 2, 3, 4, 5]
  const date = new Date('2026-08-30T23:00:00Z')
  assert.deepEqual(dailyShuffle(input, date), dailyShuffle(input, date))
  assert.deepEqual(input, [1, 2, 3, 4, 5])
})

test('validates the date and items', () => {
  assert.throws(() => dailyShuffle('abc'), /array/)
  assert.throws(() => dailyShuffle([], new Date('invalid')), /valid Date/)
})
