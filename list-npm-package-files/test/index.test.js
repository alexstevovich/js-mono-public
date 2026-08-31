import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'

import listNpmPackageFiles from '../src/index.js'

test('lists files npm would pack without creating an archive', async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'npm-files-'))
  t.after(() => fs.rm(root, { recursive: true, force: true }))
  await fs.writeFile(
    path.join(root, 'package.json'),
    JSON.stringify({ name: 'fixture', version: '1.0.0', files: ['src'] }),
  )
  await fs.mkdir(path.join(root, 'src'))
  await fs.writeFile(
    path.join(root, 'src', 'index.js'),
    'export default true\n',
  )
  await fs.writeFile(path.join(root, 'ignored.txt'), 'ignored')

  const files = await listNpmPackageFiles(root)

  assert.equal(files.includes('src/index.js'), true)
  assert.equal(files.includes('ignored.txt'), false)
  assert.equal(files.includes('package.json'), true)
})
