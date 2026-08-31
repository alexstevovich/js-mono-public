import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import readFilesToString from '../src/index.js'

test('reads files in input order sequentially or in parallel', async (context) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'read-files-'))
  context.after(() => fs.rm(root, { recursive: true, force: true }))
  const first = path.join(root, 'first.txt')
  const second = path.join(root, 'second.txt')
  await fs.writeFile(first, 'one')
  await fs.writeFile(second, 'two')

  assert.equal(await readFilesToString([first, second]), 'onetwo')
  assert.equal(
    await readFilesToString([first, second], {
      concurrency: 'parallel',
      delimiter: '[{{PATH}}]',
    }),
    `[${first}]one[${second}]two`,
  )
})
