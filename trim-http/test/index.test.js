import assert from 'node:assert/strict'
import test from 'node:test'

import trimHttp from '../src/index.js'

test('removes HTTP and HTTPS prefixes', () => {
  assert.equal(trimHttp('http://example.com'), 'example.com')
  assert.equal(trimHttp('https://example.com'), 'example.com')
})

test('leaves other values unchanged', () => {
  assert.equal(trimHttp('example.com'), 'example.com')
  assert.equal(trimHttp(null), null)
})
