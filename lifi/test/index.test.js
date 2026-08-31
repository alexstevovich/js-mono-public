import assert from 'node:assert/strict'
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'

import listFiles, { listFilesSync } from '../src/index.js'

async function fixture(t) {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'lifi-'))
  t.after(() => rm(directory, { force: true, recursive: true }))
  await mkdir(path.join(directory, 'nested'))
  await Promise.all([
    writeFile(path.join(directory, 'b.txt'), ''),
    writeFile(path.join(directory, 'a.json'), ''),
    writeFile(path.join(directory, 'nested', 'c.json'), ''),
  ])
  return directory
}

test('lists top-level files in deterministic order by default', async (t) => {
  const directory = await fixture(t)
  assert.deepEqual(await listFiles(directory), ['a.json', 'b.txt'])
})

test('lists recursively and filters extensions', async (t) => {
  const directory = await fixture(t)
  assert.deepEqual(await listFiles(directory, { recursive: true }), [
    'a.json',
    'b.txt',
    path.join('nested', 'c.json'),
  ])
  assert.deepEqual(
    listFilesSync(directory, { recursive: true, extensions: ['.json'] }),
    ['a.json', path.join('nested', 'c.json')],
  )
})

test('rejects invalid extension filters', async (t) => {
  const directory = await fixture(t)
  await assert.rejects(() => listFiles(directory, { extensions: '.js' }), {
    name: 'TypeError',
  })
})
