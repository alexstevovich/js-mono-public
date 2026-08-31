import assert from 'node:assert/strict'
import test from 'node:test'

import existed from '../src/index.js'

test('existed', () => {
  assert.equal(existed, true)
})
