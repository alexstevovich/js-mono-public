import assert from 'node:assert/strict'
import test from 'node:test'
import findCStyleCodeStartIndex from '../src/index.js'

test('skips leading comments, whitespace, and a shebang', () => {
  const content = '#!/usr/bin/env node\n/* header */\n// note\nconst value = 1'
  assert.equal(
    content.slice(findCStyleCodeStartIndex(content)),
    'const value = 1',
  )
})

test('returns -1 when there is no code', () => {
  assert.equal(findCStyleCodeStartIndex('/* comment */ // tail'), -1)
  assert.equal(findCStyleCodeStartIndex('#!/usr/bin/env node'), -1)
})
