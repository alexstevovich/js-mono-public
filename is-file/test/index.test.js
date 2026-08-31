import assert from 'node:assert/strict'
import test from 'node:test'
import isFile from '../src/index.js'

test('distinguishes files from directories and missing paths', async () => {
  assert.equal(await isFile(import.meta.filename), true)
  assert.equal(await isFile(import.meta.dirname), false)
  assert.equal(await isFile(`${import.meta.filename}.missing`), false)
})
