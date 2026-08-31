import assert from 'node:assert/strict'
import test from 'node:test'

import isValidUuid from '../src/index.js'

test('validates RFC 9562 UUID strings from versions 1 through 8', () => {
  assert.equal(isValidUuid('6f9619ff-8b86-11d1-b42d-00c04fc964ff'), true)
  assert.equal(isValidUuid('550e8400-e29b-41d4-a716-446655440000'), true)
  assert.equal(isValidUuid('018f8e7b-7d31-7c2d-8c7a-3f6c4f9f9132'), true)
  assert.equal(isValidUuid('018f8e7b-7d31-8c2d-8c7a-3f6c4f9f9132'), true)
})

test('checks a requested version', () => {
  const uuid = '550e8400-e29b-41d4-a716-446655440000'
  assert.equal(isValidUuid(uuid, { version: 4 }), true)
  assert.equal(isValidUuid(uuid, { version: 7 }), false)
  assert.equal(isValidUuid(uuid, { version: 9 }), false)
})

test('accepts mixed case unless strict lowercase is requested', () => {
  const uuid = '550E8400-e29b-41D4-a716-446655440000'
  assert.equal(isValidUuid(uuid), true)
  assert.equal(isValidUuid(uuid, { strictCase: true }), false)
})

test('rejects non-UUID, nil, max, and non-string values', () => {
  assert.equal(isValidUuid('not-a-uuid'), false)
  assert.equal(isValidUuid('00000000-0000-0000-0000-000000000000'), false)
  assert.equal(isValidUuid('ffffffff-ffff-ffff-ffff-ffffffffffff'), false)
  assert.equal(isValidUuid(null), false)
})
