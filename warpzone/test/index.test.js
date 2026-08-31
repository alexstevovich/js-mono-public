import assert from 'node:assert/strict'
import { mkdir, mkdtemp, rm } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'

import warpzone from '../src/index.js'

test('provides self-contained filesystem operations', async (t) => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'warpzone-'))
  t.after(() => rm(directory, { force: true, recursive: true }))
  await mkdir(path.join(directory, 'nested'))
  await warpzone.write(path.join(directory, 'a.txt'), 'A')
  await warpzone.write(path.join(directory, 'nested', 'b.txt'), 'B')

  assert.equal(await warpzone.read(path.join(directory, 'a.txt')), 'A')
  assert.deepEqual(await warpzone.list(directory), ['a.txt'])
  assert.equal(await warpzone.string(directory, { extensions: ['.txt'] }), 'AB')
})
