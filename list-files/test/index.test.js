import assert from 'node:assert/strict'
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'

import listFiles from '../src/index.js'

test('lists and filters relative file paths', async (t) => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'list-files-'))
  t.after(() => rm(root, { force: true, recursive: true }))
  await mkdir(path.join(root, 'nested'))
  await writeFile(path.join(root, 'a.json'), '')
  await writeFile(path.join(root, 'b.txt'), '')
  await writeFile(path.join(root, 'nested', 'c.json'), '')

  assert.deepEqual(
    await listFiles(root, { recursive: true, extensions: ['.json'] }),
    ['a.json', path.join('nested', 'c.json')],
  )
})
