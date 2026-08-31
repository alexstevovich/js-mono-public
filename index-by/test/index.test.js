import assert from 'node:assert/strict'
import test from 'node:test'

import indexBy from '../src/index.js'

test('indexes items by the selected property', () => {
  const first = { id: 'first', value: 1 }
  const second = { id: 'second', value: 2 }

  assert.deepEqual(indexBy([first, second], 'id'), {
    first,
    second,
  })
})

test('uses the final item when keys repeat', () => {
  assert.deepEqual(
    indexBy(
      [
        { id: 'same', value: 1 },
        { id: 'same', value: 2 },
      ],
      'id',
    ),
    { same: { id: 'same', value: 2 } },
  )
})
