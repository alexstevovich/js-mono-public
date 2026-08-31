import assert from 'node:assert/strict'
import test from 'node:test'
import lineStartIndex from '../src/index.js'

test('finds the containing line start', () => {
  assert.equal(lineStartIndex('one\ntwo\nthree', 6), 4)
  assert.equal(lineStartIndex('one\ntwo\n', 8), 8)
})

test('returns -1 for invalid indexes', () => {
  assert.equal(lineStartIndex('one', -1), -1)
  assert.equal(lineStartIndex('one', 4), -1)
})
