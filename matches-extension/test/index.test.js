import assert from 'node:assert/strict'
import test from 'node:test'
import matchesExtension from '../src/index.js'

test('matches any allowed suffix', () => {
  assert.equal(matchesExtension('archive.tar.gz', ['.zip', '.tar.gz']), true)
  assert.equal(matchesExtension('index.js', ['.ts']), false)
  assert.equal(matchesExtension('index.js', []), true)
})

test('validates extensions', () => {
  assert.throws(() => matchesExtension('index.js', '.js'), /array/)
})
