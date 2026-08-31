import assert from 'node:assert/strict'
import test from 'node:test'

import diffManifests from '../src/index.js'

test('classifies and sorts entries without mutating inputs', () => {
  const source = [
    { path: 'z.txt', type: 'file' },
    { path: 'change.txt', type: 'file' },
    { path: 'same.txt', type: 'file' },
    { path: 'a.txt', type: 'file' },
  ]
  const target = [
    { path: 'removed.txt', type: 'file' },
    { path: 'change.txt', type: 'dir' },
    { path: 'same.txt', type: 'file' },
  ]
  const sourceSnapshot = structuredClone(source)
  const targetSnapshot = structuredClone(target)

  const result = diffManifests(source, target)

  assert.deepEqual(
    result.add.map((entry) => entry.path),
    ['a.txt', 'z.txt'],
  )
  assert.deepEqual(
    result.remove.map((entry) => entry.path),
    ['removed.txt'],
  )
  assert.deepEqual(result.change, [
    {
      source: source[1],
      target: target[1],
      fields: ['type'],
    },
  ])
  assert.deepEqual(result.same, [
    {
      source: source[2],
      target: target[2],
    },
  ])
  assert.deepEqual(source, sourceSnapshot)
  assert.deepEqual(target, targetSnapshot)
})

test('reports every requested field that changed', () => {
  const source = [
    {
      path: 'file.txt',
      type: 'file',
      size: 10,
      mtimeMs: 1000,
      hash: 'source-hash',
    },
  ]
  const target = [
    {
      path: 'file.txt',
      type: 'file',
      size: 20,
      mtimeMs: 2000,
      hash: 'target-hash',
    },
  ]

  const result = diffManifests(source, target, {
    size: true,
    mtimeMs: true,
    hash: true,
  })

  assert.deepEqual(result.change[0].fields, ['size', 'mtimeMs', 'hash'])
})

test('compares link targets by default', () => {
  const source = [
    {
      path: 'current',
      type: 'link',
      target: 'releases/2',
    },
  ]
  const target = [
    {
      path: 'current',
      type: 'link',
      target: 'releases/1',
    },
  ]

  const result = diffManifests(source, target)

  assert.deepEqual(result.change[0].fields, ['target'])
})

test('allows link-target comparison to be disabled', () => {
  const source = [{ path: 'current', type: 'link' }]
  const target = [{ path: 'current', type: 'link' }]

  const result = diffManifests(source, target, { linkTarget: false })

  assert.equal(result.same.length, 1)
})

test('throws when requested comparison evidence is missing', () => {
  const source = [{ path: 'file.txt', type: 'file', hash: 'abc' }]
  const target = [{ path: 'file.txt', type: 'file' }]

  assert.throws(
    () => diffManifests(source, target, { hash: true }),
    /field missing from target manifest/,
  )
})

test('throws on duplicate paths', () => {
  const source = [
    { path: 'file.txt', type: 'file' },
    { path: 'file.txt', type: 'file' },
  ]

  assert.throws(
    () => diffManifests(source, []),
    /Duplicate path in source manifest/,
  )
})

test('throws on malformed manifests and records', () => {
  assert.throws(() => diffManifests({}, []), /source manifest must be an array/)
  assert.throws(
    () => diffManifests([{ path: '', type: 'file' }], []),
    /path must be a non-empty string/,
  )
  assert.throws(
    () => diffManifests([{ path: 'thing', type: 'unknown' }], []),
    /has an invalid type/,
  )
})
