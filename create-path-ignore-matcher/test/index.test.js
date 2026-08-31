import assert from 'node:assert/strict'
import test from 'node:test'

import createPathIgnoreMatcher from '../src/index.js'

test('matches ignores and explicit restorations', () => {
  const isIgnored = createPathIgnoreMatcher(['*.log', '!logs/keep.log'])
  assert.equal(isIgnored('logs/error.log', false), true)
  assert.equal(isIgnored('logs/keep.log', false), false)
  assert.equal(isIgnored('README.md', false), false)
})

test('respects root anchoring', () => {
  const isIgnored = createPathIgnoreMatcher(['/build/'])
  assert.equal(isIgnored('build/', true), true)
  assert.equal(isIgnored('src/build/', true), false)
})
