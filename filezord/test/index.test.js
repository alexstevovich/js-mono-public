import assert from 'node:assert/strict'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'

import filezord from '../src/index.js'

test('creates a standardized Filezord document', async (t) => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'filezord-'))
  t.after(() => rm(directory, { force: true, recursive: true }))
  const file = path.join(directory, 'example.js')
  await writeFile(file, 'export default 42\n')

  const document = await filezord([file], {
    id: 'example',
    rootDirectory: directory,
  })
  assert.match(document, /FILEZORD AGGREGATION/)
  assert.match(document, /Total files: 1/)
  assert.match(document, /Identifier: example/)
  assert.match(document, /FILE: example\.js/)
  assert.match(document, /export default 42/)
})
