import assert from 'node:assert/strict'
import test from 'node:test'

import commonIgnorePatterns from '../src/index.js'

test('contains unique generated-path patterns', () => {
  assert.equal(new Set(commonIgnorePatterns).size, commonIgnorePatterns.length)
  assert.equal(commonIgnorePatterns.includes('node_modules/'), true)
  assert.equal(commonIgnorePatterns.includes('__pycache__/'), true)
})

test('does not ignore source manifests or lockfiles by default', () => {
  for (const name of ['Makefile', 'go.mod', 'go.sum', 'package-lock.json']) {
    assert.equal(commonIgnorePatterns.includes(name), false)
  }
})
