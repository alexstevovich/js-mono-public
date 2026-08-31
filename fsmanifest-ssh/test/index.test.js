import assert from 'node:assert/strict'
import test from 'node:test'

import remoteDirectoryManifest from '../src/index.js'

test('rejects an invalid missing-directory policy before connecting', async () => {
  await assert.rejects(
    remoteDirectoryManifest('.', {}, { missing: 'ignore' }),
    /missing must be either "error" or "empty"/,
  )
})
