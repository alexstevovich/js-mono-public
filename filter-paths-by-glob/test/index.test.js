import assert from 'node:assert/strict'
import path from 'node:path'
import test from 'node:test'

import filterPathsByGlob from '../src/index.js'

test('filters paths relative to a base directory', () => {
  const baseDirectory = path.resolve('project')
  const paths = ['src/index.js', 'src/index.test.js', 'README.md']

  assert.deepEqual(
    filterPathsByGlob(baseDirectory, paths, ['**/*.js', '!**/*.test.js']),
    ['src/index.js'],
  )
})

test('preserves distinct original forms of the same path', () => {
  const baseDirectory = path.resolve('project')
  const relative = 'src/index.js'
  const absolute = path.resolve(baseDirectory, relative)

  assert.deepEqual(
    filterPathsByGlob(baseDirectory, [relative, absolute], '**/*.js'),
    [relative, absolute],
  )
})
