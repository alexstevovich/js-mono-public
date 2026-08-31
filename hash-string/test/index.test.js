import assert from 'node:assert/strict'
import test from 'node:test'
import hashString from '../src/index.js'

test('hashes strings with SHA-256 by default', () => {
  assert.equal(
    hashString('hello'),
    '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
  )
  assert.equal(hashString('hello', 'md5'), '5d41402abc4b2a76b9719d911017c592')
})

test('requires a string', () => {
  assert.throws(() => hashString(Buffer.from('hello')), /string/)
})
