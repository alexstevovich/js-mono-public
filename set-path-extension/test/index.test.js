import assert from 'node:assert/strict'
import test from 'node:test'
import setPathExtension from '../src/index.js'

test('sets, replaces, and removes the final extension', () => {
  assert.equal(setPathExtension('archive.tar.gz', 'zip'), 'archive.tar.zip')
  assert.equal(setPathExtension('README', '.md'), 'README.md')
  assert.equal(setPathExtension('file.txt', null), 'file')
})

test('leaves directory paths unchanged', () => {
  assert.equal(setPathExtension('folder/', '.txt'), 'folder/')
})
