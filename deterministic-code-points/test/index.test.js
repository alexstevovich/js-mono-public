import assert from 'node:assert/strict'
import test from 'node:test'
import deterministicCodePoints from '../src/index.js'

test('is repeatable and counts Unicode code points', () => {
  const first = deterministicCodePoints('ab🙂', 40, 'seed')
  const second = deterministicCodePoints('ab🙂', 40, 'seed')
  assert.equal(first, second)
  assert.equal([...first].length, 40)
})

test('supports Buffer seeds and zero length', () => {
  assert.equal(deterministicCodePoints('x', 3, Buffer.from('seed')), 'xxx')
  assert.equal(deterministicCodePoints('abc', 0, 'seed'), '')
})
