import assert from 'node:assert/strict'
import test from 'node:test'
import nextLineStartIndex from '../src/index.js'

test('finds the next line start', () => {
  assert.equal(nextLineStartIndex('one\ntwo\nthree', 0), 4)
  assert.equal(nextLineStartIndex('one\ntwo\nthree', 4), 8)
  assert.equal(nextLineStartIndex('one', 0), -1)
})

test('returns -1 for an index at the end', () => {
  assert.equal(nextLineStartIndex('one', 3), -1)
})
