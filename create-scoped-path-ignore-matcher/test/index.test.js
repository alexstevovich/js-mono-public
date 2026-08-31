import assert from 'node:assert/strict'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'

import createScopedPathIgnoreMatcher from '../src/index.js'

test('builds a matcher from ignore files', async (t) => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'scoped-ignore-'))
  t.after(() => rm(root, { force: true, recursive: true }))
  await mkdir(path.join(root, 'src'))
  await writeFile(path.join(root, '.ignore'), 'trace.txt\nsrc/\n')
  await writeFile(path.join(root, 'trace.txt'), '')
  await writeFile(path.join(root, 'src', 'index.js'), '')

  const isIgnored = await createScopedPathIgnoreMatcher(root, {
    pathexFiles: ['.ignore'],
  })
  assert.equal(isIgnored('trace.txt'), true)
  assert.equal(isIgnored('src/'), true)
})
