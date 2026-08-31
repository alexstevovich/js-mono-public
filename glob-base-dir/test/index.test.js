import assert from 'node:assert/strict'
import test from 'node:test'
import path from 'node:path'
import globBaseDir from '../src/index.js'

test('extracts the static path before glob syntax', () => {
  assert.equal(globBaseDir('src/utils/**/*.js'), path.normalize('src/utils'))
  assert.equal(globBaseDir('*.js'), '.')
  assert.equal(globBaseDir('src/index.js'), path.normalize('src/index.js'))
})

test('requires a string', () => {
  assert.throws(() => globBaseDir(null), /string/)
})
