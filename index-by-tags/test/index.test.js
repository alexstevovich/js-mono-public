import assert from 'node:assert/strict'
import test from 'node:test'

import indexByTags from '../src/index.js'

test('indexes each item under all of its tags', () => {
  const first = { tags: ['a', 'b'] }
  const second = { tags: ['b'] }

  assert.deepEqual(indexByTags([first, second]), {
    a: [first],
    b: [first, second],
  })
})

test('supports a custom tag getter', () => {
  const item = { labels: ['custom'] }
  assert.deepEqual(
    indexByTags([item], (value) => value.labels),
    {
      custom: [item],
    },
  )
})
