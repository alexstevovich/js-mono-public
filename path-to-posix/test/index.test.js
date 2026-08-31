import assert from 'node:assert/strict'
import test from 'node:test'

import pathToPosix from '../src/index.js'

test('converts Windows separators independently of the host platform', () => {
  assert.equal(pathToPosix('C:\\work\\src\\index.js'), 'C:/work/src/index.js')
  assert.equal(pathToPosix('src/index.js'), 'src/index.js')
  assert.equal(pathToPosix('\\\\server\\share'), '//server/share')
})

test('requires a string', () => {
  assert.throws(() => pathToPosix(null), /value must be a string/)
})
