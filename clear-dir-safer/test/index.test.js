import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'

import clearDirSafer from '../src/index.js'

test('clears and recreates only the expected directory', async (t) => {
  const parent = await fs.mkdtemp(path.join(os.tmpdir(), 'clear-dir-safer-'))
  const target = path.join(parent, 'expected-target')
  await fs.mkdir(target)
  await fs.writeFile(path.join(target, 'file.txt'), 'content')
  t.after(() => fs.rm(parent, { recursive: true, force: true }))

  await clearDirSafer(target, 'expected-target')

  assert.deepEqual(await fs.readdir(target), [])
})

test('rejects a mismatched directory name', async () => {
  await assert.rejects(
    clearDirSafer('some/sufficiently/long/path', 'different-name'),
    /unexpected name/,
  )
})
