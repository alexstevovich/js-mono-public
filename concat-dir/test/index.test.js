import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'

import concatDir, { concatDirSync } from '../src/index.js'

async function createFixture(t) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'concat-dir-'))
  await fs.mkdir(path.join(root, 'b'))
  await fs.writeFile(path.join(root, 'a.txt'), ' alpha ')
  await fs.writeFile(path.join(root, 'b', 'b.txt'), 'beta')
  await fs.writeFile(path.join(root, 'c.md'), 'gamma')
  t.after(() => fs.rm(root, { recursive: true, force: true }))
  return root
}

test('concatenates matching files recursively in deterministic order', async (t) => {
  const root = await createFixture(t)
  const options = { extensions: ['.txt'], separator: '|' }
  assert.equal(await concatDir(root, options), ' alpha |beta')
  assert.equal(concatDirSync(root, options), ' alpha |beta')
})

test('can limit traversal to the given directory', async (t) => {
  const root = await createFixture(t)
  assert.equal(
    await concatDir(root, { recursive: false, separator: '|' }),
    ' alpha |gamma',
  )
})

test('preserves file whitespace', async (t) => {
  const root = await createFixture(t)
  assert.equal(
    await concatDir(root, { extensions: ['.txt'], recursive: false }),
    ' alpha ',
  )
})
