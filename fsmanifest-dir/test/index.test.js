import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'

import createDirectoryManifest from '../src/index.js'

async function createFixture(t) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'fsmanifest-dir-'))

  t.after(async () => {
    await fs.rm(root, { recursive: true, force: true })
  })

  await fs.mkdir(path.join(root, 'nested'))
  await fs.writeFile(path.join(root, 'z.txt'), 'zebra')
  await fs.writeFile(path.join(root, 'nested', 'a.txt'), 'alpha')

  return root
}

test('returns a sorted recursive inventory with portable paths', async (t) => {
  const root = await createFixture(t)

  const manifest = await createDirectoryManifest(root, {
    recursive: true,
  })

  assert.deepEqual(manifest, [
    { path: 'nested', type: 'dir' },
    { path: 'nested/a.txt', type: 'file' },
    { path: 'z.txt', type: 'file' },
  ])
})

test('does not recurse unless requested', async (t) => {
  const root = await createFixture(t)

  const manifest = await createDirectoryManifest(root)

  assert.deepEqual(manifest, [
    { path: 'nested', type: 'dir' },
    { path: 'z.txt', type: 'file' },
  ])
})

test('includes only explicitly requested metadata fields', async (t) => {
  const root = await createFixture(t)
  const filePath = path.join(root, 'z.txt')
  const requestedMtimeMs = 1_700_000_000_789

  await fs.utimes(filePath, requestedMtimeMs / 1000, requestedMtimeMs / 1000)

  const sizeOnly = await createDirectoryManifest(root, {
    dirs: false,
    size: true,
  })

  assert.deepEqual(sizeOnly, [{ path: 'z.txt', type: 'file', size: 5 }])

  const mtimeOnly = await createDirectoryManifest(root, {
    dirs: false,
    mtimeMs: true,
  })

  assert.deepEqual(mtimeOnly, [
    {
      path: 'z.txt',
      type: 'file',
      mtimeMs: Math.floor(requestedMtimeMs / 1000) * 1000,
    },
  ])
})

test('hashes regular files with SHA-256 without adding stats', async (t) => {
  const root = await createFixture(t)

  const manifest = await createDirectoryManifest(root, {
    dirs: false,
    hash: true,
  })

  assert.deepEqual(manifest, [
    {
      path: 'z.txt',
      type: 'file',
      hash: crypto.createHash('sha256').update('zebra').digest('hex'),
    },
  ])
})

test('filters files and directories independently', async (t) => {
  const root = await createFixture(t)

  const files = await createDirectoryManifest(root, {
    recursive: true,
    dirs: false,
  })

  assert.deepEqual(files, [
    { path: 'nested/a.txt', type: 'file' },
    { path: 'z.txt', type: 'file' },
  ])

  const dirs = await createDirectoryManifest(root, {
    recursive: true,
    files: false,
  })

  assert.deepEqual(dirs, [{ path: 'nested', type: 'dir' }])
})
