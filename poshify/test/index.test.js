import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'

import { sort, sortAndSavePackageJson } from '../src/index.js'

test('sorts known and unknown keys in place', () => {
  const packageData = {
    dependencies: {},
    zebra: true,
    name: 'example',
    alpha: true,
    version: '1.0.0',
  }

  assert.equal(sort(packageData), packageData)
  assert.deepEqual(Object.keys(packageData), [
    'name',
    'version',
    'alpha',
    'zebra',
    'dependencies',
  ])
})

test('sorts and saves package.json with a trailing newline', async (context) => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'poshify-'))
  context.after(() => fs.rm(directory, { recursive: true, force: true }))
  await fs.writeFile(
    path.join(directory, 'package.json'),
    '{"scripts":{},"name":"example","version":"1.0.0"}',
  )

  await sortAndSavePackageJson(directory)
  const result = await fs.readFile(path.join(directory, 'package.json'), 'utf8')
  assert.equal(result.endsWith('\n'), true)
  assert.deepEqual(Object.keys(JSON.parse(result)), [
    'name',
    'version',
    'scripts',
  ])
})
