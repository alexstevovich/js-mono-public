import assert from 'node:assert/strict'
import test from 'node:test'
import stripGlobBaseDir from '../src/index.js'

test('retains the pattern beginning with its first dynamic segment', () => {
  assert.equal(stripGlobBaseDir('src\\utils\\**\\*.js'), '**/*.js')
  assert.equal(stripGlobBaseDir('*.js'), '*.js')
  assert.equal(stripGlobBaseDir('src/index.js'), '')
})

test('requires a string', () => {
  assert.throws(() => stripGlobBaseDir(null), /string/)
})
