import assert from 'node:assert/strict'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'

import loadPathPatternFiles from '../src/index.js'

test('loads available files in order and ignores missing files', async (t) => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'patterns-'))
  t.after(() => rm(directory, { force: true, recursive: true }))
  await writeFile(path.join(directory, 'include'), '# comment\nsrc/**\n')
  await writeFile(path.join(directory, 'exclude'), '!src/tmp/**\n')

  assert.deepEqual(
    await loadPathPatternFiles(directory, ['include', 'missing', 'exclude']),
    ['src/**', '!src/tmp/**'],
  )
})
