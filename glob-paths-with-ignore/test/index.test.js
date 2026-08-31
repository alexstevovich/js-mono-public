import assert from 'node:assert/strict'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'

import globPathsWithIgnore from '../src/index.js'

test('filters scanned files by glob and ignore rules', async (t) => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'ignore-glob-'))
  t.after(() => rm(root, { force: true, recursive: true }))
  await mkdir(path.join(root, 'src'))
  await mkdir(path.join(root, 'ignored'))
  await writeFile(path.join(root, '.gitignore'), 'ignored/\n')
  await writeFile(path.join(root, 'src', 'index.js'), '')
  await writeFile(path.join(root, 'src', 'index.txt'), '')
  await writeFile(path.join(root, 'ignored', 'secret.js'), '')

  assert.deepEqual(
    await globPathsWithIgnore(root, '**/*.js', {
      ignoreRuleFiles: ['.gitignore'],
    }),
    ['src/index.js'],
  )
})

test('rejects globs containing parent-directory segments', async () => {
  await assert.rejects(() => globPathsWithIgnore('.', '../**/*.js'), /escapes/)
})
