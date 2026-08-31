import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'

import io8, { copySync, readSync, writeSync } from '../src/index.js'

test('reads and writes UTF-8 text by default', async (t) => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'io8-'))
  t.after(() => rm(directory, { force: true, recursive: true }))
  const filePath = path.join(directory, 'message.txt')

  await io8.write(filePath, 'hello 🌐')
  assert.equal(await io8.read(filePath), 'hello 🌐')
})

test('copies binary files without decoding them', async (t) => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'io8-'))
  t.after(() => rm(directory, { force: true, recursive: true }))
  const source = path.join(directory, 'source.bin')
  const asyncCopy = path.join(directory, 'async.bin')
  const syncCopy = path.join(directory, 'sync.bin')
  const bytes = Buffer.from([0, 255, 128, 13, 10])

  await io8.write(source, bytes)
  await io8.copy(source, asyncCopy)
  copySync(source, syncCopy)

  assert.deepEqual(await readFile(asyncCopy), bytes)
  assert.deepEqual(await readFile(syncCopy), bytes)
})

test('provides synchronous text helpers', (t) => {
  const directory = fsMkdtemp(t)
  const filePath = path.join(directory, 'message.txt')

  writeSync(filePath, 'hello')
  assert.equal(readSync(filePath), 'hello')
})

function fsMkdtemp(t) {
  const directory = fsSyncMkdtemp(path.join(os.tmpdir(), 'io8-'))
  t.after(() => fsSyncRm(directory, { force: true, recursive: true }))
  return directory
}

import { mkdtempSync as fsSyncMkdtemp, rmSync as fsSyncRm } from 'node:fs'
