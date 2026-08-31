import assert from 'node:assert/strict'
import test from 'node:test'

import ordinal from '../src/index.js'

test('formats English ordinal suffixes', () => {
  assert.equal(ordinal(1), '1st')
  assert.equal(ordinal(2), '2nd')
  assert.equal(ordinal(3), '3rd')
  assert.equal(ordinal(4), '4th')
  assert.equal(ordinal(11), '11th')
  assert.equal(ordinal(12), '12th')
  assert.equal(ordinal(13), '13th')
  assert.equal(ordinal(21), '21st')
  assert.equal(ordinal(112), '112th')
})

test('supports zero and negative integers', () => {
  assert.equal(ordinal(0), '0th')
  assert.equal(ordinal(-1), '-1st')
  assert.equal(ordinal(-12), '-12th')
})

test('rejects values without an exact integer representation', () => {
  assert.throws(() => ordinal(1.5), /safe integer/)
  assert.throws(() => ordinal(Infinity), /safe integer/)
})
