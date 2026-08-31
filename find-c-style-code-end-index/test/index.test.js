import assert from 'node:assert/strict'
import test from 'node:test'
import findCStyleCodeEndIndex from '../src/index.js'

test('finds final code before trailing comments', () => {
  const content = 'const url = "https://example.com"; /* tail */\n// done'
  assert.equal(findCStyleCodeEndIndex(content), content.indexOf(';'))
})

test('handles escaped quotes and comment-only input', () => {
  const content = 'const value = "a\\\"//b"; // tail'
  assert.equal(findCStyleCodeEndIndex(content), content.indexOf(';'))
  assert.equal(findCStyleCodeEndIndex('/* comment */'), -1)
})
