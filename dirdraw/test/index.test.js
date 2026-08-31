import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'

import dirdraw, {
  createDirectoryTreeData,
  renderDirectoryTree,
} from '../src/index.js'

test('creates and renders a directory tree', async (context) => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'dirdraw-'))
  context.after(() => fs.rm(directory, { force: true, recursive: true }))
  await fs.mkdir(path.join(directory, 'nested'))
  await fs.writeFile(path.join(directory, 'nested', 'file.txt'), 'hello')

  const data = await createDirectoryTreeData(directory, { sizeMode: 'total' })
  assert.equal(data.type, 'directory')
  assert.equal(data.size, 5)
  assert.match(renderDirectoryTree(data), /nested\//)
  assert.match(await dirdraw(directory), /file\.txt/)
})

test('seals ignored directories', async (context) => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'dirdraw-'))
  context.after(() => fs.rm(directory, { force: true, recursive: true }))
  await fs.mkdir(path.join(directory, 'private'))
  await fs.writeFile(path.join(directory, 'private', 'secret.txt'), 'secret')

  const output = await dirdraw(directory, { globalIgnoreRules: ['private/'] })
  assert.match(output, /private\/ SEALED/)
  assert.doesNotMatch(output, /secret\.txt/)
})
