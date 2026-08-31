import assert from 'node:assert/strict'
import test from 'node:test'

import snakeToCamelKeys from '../src/index.js'

test('converts object keys recursively', () => {
  assert.deepEqual(
    snakeToCamelKeys({ outer_key: [{ inner_key: 1 }], unchanged: true }),
    { outerKey: [{ innerKey: 1 }], unchanged: true },
  )
})

test('returns primitive values unchanged', () => {
  assert.equal(snakeToCamelKeys('snake_value'), 'snake_value')
  assert.equal(snakeToCamelKeys(null), null)
})
