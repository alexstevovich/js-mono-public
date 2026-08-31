import assert from 'node:assert/strict'
import test from 'node:test'
import isGlobRecursive from '../src/index.js'

test('detects complete globstar path segments', () => {
  assert.equal(isGlobRecursive('src/**/*.js'), true)
  assert.equal(isGlobRecursive('src\\**\\*.js'), true)
  assert.equal(isGlobRecursive('src/*.js'), false)
  assert.equal(isGlobRecursive('src/foo**bar.js'), false)
})
