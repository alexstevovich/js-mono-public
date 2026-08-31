import assert from 'node:assert/strict'
import test from 'node:test'
import resolveRequestClientIp from '../src/index.js'

test('uses the socket address by default', () => {
  const request = {
    headers: { 'x-forwarded-for': '203.0.113.10' },
    ip: '198.51.100.12',
    socket: { remoteAddress: '127.0.0.1' },
  }

  assert.equal(resolveRequestClientIp(request), '127.0.0.1')
})

test('uses the first forwarded address when proxy trust is explicit', () => {
  const request = {
    headers: {
      'x-forwarded-for': '203.0.113.10, 198.51.100.12',
    },
    socket: { remoteAddress: '127.0.0.1' },
  }

  assert.equal(
    resolveRequestClientIp(request, { trustProxy: true }),
    '203.0.113.10',
  )
})

test('supports Headers-style access and framework request.ip', () => {
  const headers = new Headers({ 'x-forwarded-for': '203.0.113.20' })
  assert.equal(
    resolveRequestClientIp({ headers }, { trustProxy: true }),
    '203.0.113.20',
  )
  assert.equal(
    resolveRequestClientIp({ ip: '198.51.100.20' }, { trustProxy: true }),
    '198.51.100.20',
  )
})

test('supports legacy connections and a configurable fallback', () => {
  assert.equal(
    resolveRequestClientIp({ connection: { remoteAddress: '::1' } }),
    '::1',
  )
  assert.equal(resolveRequestClientIp({}, { fallback: null }), null)
  assert.throws(() => resolveRequestClientIp(null), /must be an object/)
})
