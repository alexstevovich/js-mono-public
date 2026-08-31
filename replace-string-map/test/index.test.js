import assert from 'node:assert/strict'
import test from 'node:test'

import replaceStringMap from '../src/index.js'

test('replaces every occurrence of multiple literal keys', () => {
  assert.equal(
    replaceStringMap('{{hello}}, {{name}}—{{name}}!', {
      '{{hello}}': 'Hello',
      '{{name}}': 'Alex',
    }),
    'Hello, Alex—Alex!',
  )
})

test('returns unchanged content when no key matches', () => {
  assert.equal(replaceStringMap('unchanged', { missing: 'value' }), 'unchanged')
})
