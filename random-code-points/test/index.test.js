import assert from 'node:assert/strict'
import test from 'node:test'
import randomCodePoints from '../src/index.js'

test('selects complete Unicode code points', () => {
  const result = randomCodePoints('a🙂', 20)
  assert.equal([...result].length, 20)
  assert.ok([...result].every((value) => value === 'a' || value === '🙂'))
})

test('supports zero length and validates input', () => {
  assert.equal(randomCodePoints('a', 0), '')
  assert.throws(() => randomCodePoints('', 1), /non-empty/)
})
