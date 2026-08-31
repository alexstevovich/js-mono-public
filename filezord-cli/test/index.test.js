import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'

import runFilezordCli from '../src/index.js'

test('writes a Filezord for the non-ignored files', async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'filezord-cli-'))
  t.after(() => fs.rm(root, { recursive: true, force: true }))

  await fs.writeFile(path.join(root, 'source.js'), 'export default 42\n')
  await fs.mkdir(path.join(root, 'node_modules'))
  await fs.writeFile(path.join(root, 'node_modules', 'ignored.js'), 'ignored')

  const result = await runFilezordCli({ rootDirectory: root, id: 'test' })
  const document = await fs.readFile(result.outputPath, 'utf8')

  assert.deepEqual(result.files, ['source.js'])
  assert.match(document, /FILEZORD AGGREGATION/)
  assert.match(document, /Identifier: test/)
  assert.match(document, /FILE: source\.js/)
  assert.doesNotMatch(document, /ignored\.js/)
})
