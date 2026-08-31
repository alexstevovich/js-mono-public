import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'

import * as tar from 'tar'

import listTarEntries from '../src/index.js'

test('lists archive entries', async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'tar-list-'))
  t.after(() => fs.rm(root, { recursive: true, force: true }))
  await fs.mkdir(path.join(root, 'nested'))
  await fs.writeFile(path.join(root, 'nested', 'file.txt'), 'content')
  const archivePath = path.join(root, 'archive.tar.gz')
  await tar.c({ cwd: root, file: archivePath, gzip: true }, ['nested'])

  assert.deepEqual(await listTarEntries(archivePath), [
    'nested/',
    'nested/file.txt',
  ])
})
