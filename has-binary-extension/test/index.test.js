import assert from 'node:assert/strict'
import test from 'node:test'
import hasBinaryExtension from '../src/index.js'

test('recognizes common binary extensions case-insensitively', () => {
  assert.equal(hasBinaryExtension('image.PNG'), true)
  assert.equal(hasBinaryExtension('archive.tar.gz'), true)
  assert.equal(hasBinaryExtension('README.md'), false)
})

test('accepts a custom extension set', () => {
  assert.equal(hasBinaryExtension('file.custom', new Set(['.custom'])), true)
})
