import assert from 'node:assert/strict'
import test from 'node:test'

import { parse, serialize, validate } from '../src/index.js'

test('parses and serializes YAML front matter', () => {
  const document = '---\ntitle: Example\n---\nContent'
  assert.deepEqual(parse(document), {
    content: 'Content',
    data: { title: 'Example' },
  })
  assert.equal(validate(serialize({ title: 'Example' }, 'Content')), true)
})
