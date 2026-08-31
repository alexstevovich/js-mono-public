import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'

import replaceRemoteDirectory from '../src/index.js'

test('rejects unsafe remote directory targets before connecting', async (t) => {
  const localDirectory = await fs.mkdtemp(
    path.join(os.tmpdir(), 'sftp-replace-dir-'),
  )

  t.after(async () => {
    await fs.rm(localDirectory, { recursive: true, force: true })
  })

  for (const remoteDirectory of ['', '.', '..', '/']) {
    await assert.rejects(
      replaceRemoteDirectory(localDirectory, remoteDirectory, {}),
      /Refusing to replace unsafe remote directory/,
    )
  }
})

test('rejects a local source that is not a directory', async (t) => {
  const directory = await fs.mkdtemp(
    path.join(os.tmpdir(), 'sftp-replace-dir-'),
  )
  const filePath = path.join(directory, 'file.txt')

  await fs.writeFile(filePath, 'content')

  t.after(async () => {
    await fs.rm(directory, { recursive: true, force: true })
  })

  await assert.rejects(
    replaceRemoteDirectory(filePath, '/opt/apps/example/app/code', {}),
    /Local source is not a directory/,
  )
})
