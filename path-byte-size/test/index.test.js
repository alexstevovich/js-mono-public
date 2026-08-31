import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import pathByteSize from '../src/index.js'

test('measures files and directory trees', async (context) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'path-byte-size-'))
  context.after(() => fs.rm(root, { recursive: true, force: true }))
  await fs.mkdir(path.join(root, 'nested'))
  await fs.writeFile(path.join(root, 'one.txt'), 'abc')
  await fs.writeFile(path.join(root, 'nested', 'two.txt'), '12345')

  assert.equal(await pathByteSize(path.join(root, 'one.txt')), 3)
  assert.equal(await pathByteSize(root), 8)
})

test('can ignore missing paths', async () => {
  assert.equal(await pathByteSize('missing-path', { onError: 'ignore' }), 0)
})
