import assert from 'node:assert/strict'
import test from 'node:test'

import parsePathIgnoreRule from '../src/index.js'

test('interprets negated anchored directory rules', () => {
  assert.deepEqual(parsePathIgnoreRule('!/cache/'), {
    anchored: true,
    directoryOnly: true,
    isNegated: true,
    pattern: 'cache',
    raw: '/cache/',
  })
})
