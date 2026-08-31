import assert from 'node:assert/strict'
import test from 'node:test'

import isBotUserAgent from '../src/index.js'

test('detects common automated user agents', () => {
  assert.equal(isBotUserAgent('Mozilla/5.0 (compatible; Googlebot/2.1)'), true)
  assert.equal(isBotUserAgent('python-requests/2.32'), true)
  assert.equal(isBotUserAgent('Slackbot-LinkExpanding 1.0'), true)
})

test('does not classify ordinary user agents as bots', () => {
  assert.equal(isBotUserAgent('Mozilla/5.0 Chrome/140.0 Safari/537.36'), false)
})

test('requires a user-agent string', () => {
  assert.throws(() => isBotUserAgent(null), /expects a string/)
})
