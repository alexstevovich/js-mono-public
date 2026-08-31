import assert from 'node:assert/strict'
import test from 'node:test'
import hasParentPathSegment from '../src/index.js'

test('detects complete parent-directory segments across slash styles', () => {
  assert.equal(hasParentPathSegment('../src/**/*.js'), true)
  assert.equal(hasParentPathSegment('src\\..\\file.js'), true)
  assert.equal(hasParentPathSegment('src/.../file.js'), false)
  assert.equal(hasParentPathSegment('src/**/*.js'), false)
})
