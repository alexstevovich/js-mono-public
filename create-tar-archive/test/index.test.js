import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'

import * as tar from 'tar'

import createTarArchive from '../src/index.js'

test('creates a compressed archive from relative paths', async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'tar-create-'))
  t.after(() => fs.rm(root, { recursive: true, force: true }))
  await fs.writeFile(path.join(root, 'file.txt'), 'content')

  const archivePath = await createTarArchive(
    ['file.txt'],
    path.join(root, 'output'),
    { cwd: root, compression: 'gzip' },
  )
  const entries = []
  await tar.t({
    file: archivePath,
    onentry: (entry) => entries.push(entry.path),
  })

  assert.equal(archivePath.endsWith('.tar.gz'), true)
  assert.deepEqual(entries, ['file.txt'])
})
