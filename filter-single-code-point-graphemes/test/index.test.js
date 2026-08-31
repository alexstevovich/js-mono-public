import assert from 'node:assert/strict'
import test from 'node:test'
import filterSingleCodePointGraphemes from '../src/index.js'

test('keeps only one-code-point graphemes', () => {
  assert.equal(filterSingleCodePointGraphemes('a👨‍👩‍👧‍👦🙂e\u0301é'), 'a🙂é')
})

test('requires a string', () => {
  assert.throws(() => filterSingleCodePointGraphemes(null), /string/)
})
