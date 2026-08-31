import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import isProbablyBinaryFile from '../src/index.js'

test('detects null bytes in the inspected prefix', async (context) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'binary-file-'))
  context.after(() => fs.rm(root, { recursive: true, force: true }))
  const text = path.join(root, 'text.txt')
  const binary = path.join(root, 'binary.dat')
  await fs.writeFile(text, 'plain text')
  await fs.writeFile(binary, Buffer.from([65, 0, 66]))

  assert.equal(await isProbablyBinaryFile(text), false)
  assert.equal(await isProbablyBinaryFile(binary), true)
})

test('makes unreadable-path policy explicit', async () => {
  assert.equal(
    await isProbablyBinaryFile('missing-file', { onError: 'binary' }),
    true,
  )
  await assert.rejects(() => isProbablyBinaryFile('missing-file'))
})
