import assert from 'node:assert/strict'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'

import scanPathsWithIgnore from '../src/index.js'

test('scans recursively without returning ignored paths', async (t) => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'ignore-scan-'))
  t.after(() => rm(root, { force: true, recursive: true }))
  await mkdir(path.join(root, 'src'))
  await mkdir(path.join(root, 'ignored'))
  await writeFile(path.join(root, '.gitignore'), 'ignored/\n')
  await writeFile(path.join(root, 'src', 'index.js'), '')
  await writeFile(path.join(root, 'ignored', 'secret.js'), '')

  const files = await scanPathsWithIgnore(root, {
    ignoreRuleFiles: ['.gitignore'],
    pathTypes: 'FILE',
    recursive: true,
  })
  assert.equal(files.includes('src/index.js'), true)
  assert.equal(files.includes('ignored/secret.js'), false)
})
