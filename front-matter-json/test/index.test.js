import assert from 'node:assert/strict'
import test from 'node:test'

import { parse, serialize, validate } from '../src/index.js'

test('parses and serializes JSON front matter', () => {
  const document = '---\r\n{"title":"Example"}\r\n---\r\nContent'
  assert.deepEqual(parse(document), {
    content: 'Content',
    data: { title: 'Example' },
  })
  assert.equal(validate(serialize({ title: 'Example' }, 'Content')), true)
})

test('rejects documents without valid JSON front matter', () => {
  assert.equal(validate('Content'), false)
  assert.throws(() => parse('Content'), /Invalid front matter format/)
})
