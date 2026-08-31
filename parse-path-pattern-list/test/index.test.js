import assert from 'node:assert/strict'
import test from 'node:test'

import parsePathPatternList from '../src/index.js'

test('returns trimmed patterns without blank or comment lines', () => {
  assert.deepEqual(
    parsePathPatternList('# comment\r\nsrc/**\r\n\r\n  !src/tmp/**  '),
    ['src/**', '!src/tmp/**'],
  )
})

test('requires a string', () => {
  assert.throws(() => parsePathPatternList(null), /source must be a string/)
})
