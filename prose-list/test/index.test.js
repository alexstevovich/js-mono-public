import assert from 'node:assert/strict'
import test from 'node:test'

import formatProseList from '../src/index.js'

test('formats lists by length', () => {
  assert.equal(formatProseList([]), '')
  assert.equal(formatProseList(['one']), 'one')
  assert.equal(formatProseList(['one', 'two']), 'one and two')
  assert.equal(formatProseList(['one', 'two', 'three']), 'one, two, and three')
})

test('supports Oxford comma and conjunction options', () => {
  assert.equal(
    formatProseList(['one', 'two', 'three'], { oxford: false }),
    'one, two and three',
  )
  assert.equal(
    formatProseList(['one', 'two', 'three'], { conjunction: 'or' }),
    'one, two, or three',
  )
})

test('converts values to strings without changing the input', () => {
  const values = ['one', 2, true]
  assert.equal(formatProseList(values), 'one, 2, and true')
  assert.deepEqual(values, ['one', 2, true])
})
