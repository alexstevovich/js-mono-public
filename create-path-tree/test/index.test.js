import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'

import createPathTree from '../src/index.js'

test('creates a traversable path tree', async (t) => {
  const rootPath = await fs.mkdtemp(path.join(os.tmpdir(), 'path-tree-'))
  t.after(() => fs.rm(rootPath, { recursive: true, force: true }))

  await fs.mkdir(path.join(rootPath, 'nested'))
  await fs.writeFile(path.join(rootPath, 'one.txt'), 'one')
  await fs.writeFile(path.join(rootPath, 'nested', 'two.txt'), 'two!')

  const root = await createPathTree(rootPath)
  const nodes = root.flatten()

  assert.equal(root.isDirectory(), true)
  assert.equal(nodes.length, 4)
  assert.equal(await root.getTotalBytes(), 7)
  assert.equal(
    nodes.find((node) => node.name === 'two.txt').relativePath(),
    'nested/two.txt',
  )
})

test('limits traversal depth', async (t) => {
  const rootPath = await fs.mkdtemp(path.join(os.tmpdir(), 'path-tree-'))
  t.after(() => fs.rm(rootPath, { recursive: true, force: true }))

  await fs.mkdir(path.join(rootPath, 'nested'))
  await fs.writeFile(path.join(rootPath, 'nested', 'file.txt'), 'content')

  const root = await createPathTree(rootPath, { depth: 1 })

  assert.equal(root.flatten().length, 2)
  assert.deepEqual(root.children[0].children, [])
})

test('marks nodes using scoped ignore rules', async (t) => {
  const rootPath = await fs.mkdtemp(path.join(os.tmpdir(), 'path-tree-'))
  t.after(() => fs.rm(rootPath, { recursive: true, force: true }))

  await fs.writeFile(path.join(rootPath, '.ignore'), 'ignored.txt\n')
  await fs.writeFile(path.join(rootPath, 'ignored.txt'), 'hidden')
  await fs.writeFile(path.join(rootPath, 'visible.txt'), 'visible')

  const root = await createPathTree(rootPath, {
    ignoreRuleFiles: ['.ignore'],
  })
  const byName = new Map(root.children.map((node) => [node.name, node]))

  assert.equal(byName.get('ignored.txt').ignored, true)
  assert.equal(byName.get('visible.txt').ignored, false)
})
