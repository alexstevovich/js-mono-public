import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'

import copyDir from '../src/index.js'

test('copies nested files into a target directory', async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'copy-dir-'))
  const source = path.join(root, 'source')
  const target = path.join(root, 'target')
  await fs.mkdir(path.join(source, 'nested'), { recursive: true })
  await fs.writeFile(path.join(source, 'root.txt'), 'root')
  await fs.writeFile(path.join(source, 'nested', 'file.txt'), 'nested')
  t.after(() => fs.rm(root, { recursive: true, force: true }))

  await copyDir(source, target)

  assert.equal(await fs.readFile(path.join(target, 'root.txt'), 'utf8'), 'root')
  assert.equal(
    await fs.readFile(path.join(target, 'nested', 'file.txt'), 'utf8'),
    'nested',
  )
})
