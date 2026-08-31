import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { PassThrough } from 'node:stream'
import test from 'node:test'

import runShipmastCli from '../src/index.js'

const template = `
 * file_name: {{$file_path_relative}}
 * file_uuid: {{$file_uuid}}
 * file_hash: {{$file_hash}}
 * mast_hash: {{$mast_hash}}
`

test('applies and removes Shipmast headers through globs', async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'shipmast-cli-'))
  t.after(() => fs.rm(root, { recursive: true, force: true }))
  await fs.writeFile(path.join(root, '.shipmast'), template)
  await fs.writeFile(path.join(root, 'source.js'), 'export default true\n')
  const output = new PassThrough()

  const applied = await runShipmastCli(['*.js'], { cwd: root, stdout: output })
  assert.deepEqual(applied, { matched: 1, updated: 1 })
  assert.match(await fs.readFile(path.join(root, 'source.js'), 'utf8'), /\/\*˹/)

  const removed = await runShipmastCli(['--remove', '*.js'], {
    cwd: root,
    stdout: output,
  })
  assert.deepEqual(removed, { matched: 1, updated: 1 })
  assert.equal(
    await fs.readFile(path.join(root, 'source.js'), 'utf8'),
    'export default true\n',
  )
})

test('supports dry runs without modifying files', async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'shipmast-cli-'))
  t.after(() => fs.rm(root, { recursive: true, force: true }))
  await fs.writeFile(path.join(root, '.shipmast'), template)
  await fs.writeFile(path.join(root, 'source.js'), 'export default true\n')
  const output = new PassThrough()

  const result = await runShipmastCli(['*.js', '--dry-run'], {
    cwd: root,
    stdout: output,
  })

  assert.deepEqual(result, { matched: 1, updated: 1 })
  assert.equal(
    await fs.readFile(path.join(root, 'source.js'), 'utf8'),
    'export default true\n',
  )
})
