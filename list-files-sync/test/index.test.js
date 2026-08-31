import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'

import listFilesSync from '../src/index.js'

test('lists and filters relative file paths', (t) => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'list-files-sync-'))
  t.after(() => rmSync(root, { force: true, recursive: true }))
  mkdirSync(path.join(root, 'nested'))
  writeFileSync(path.join(root, 'a.json'), '')
  writeFileSync(path.join(root, 'b.txt'), '')
  writeFileSync(path.join(root, 'nested', 'c.json'), '')

  assert.deepEqual(
    listFilesSync(root, { recursive: true, extensions: ['.json'] }),
    ['a.json', path.join('nested', 'c.json')],
  )
})
