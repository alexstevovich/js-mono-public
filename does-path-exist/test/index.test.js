import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'

import doesPathExist from '../src/index.js'

test('reports whether a path exists', async (t) => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'path-exists-'))
  const missing = path.join(directory, 'missing')
  t.after(() => fs.rm(directory, { recursive: true, force: true }))

  assert.equal(await doesPathExist(directory), true)
  assert.equal(await doesPathExist(missing), false)
})
