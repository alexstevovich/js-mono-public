import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'

import sftpUploadFile from '../src/index.js'

test('rejects a local source that is not a file', async (t) => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'sftp-upload-'))
  t.after(() => fs.rm(directory, { recursive: true, force: true }))

  await assert.rejects(
    sftpUploadFile(directory, '/remote/file.json', {}),
    /Local source is not a file/,
  )
})

test('rejects an empty remote path', async (t) => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'sftp-upload-'))
  const file = path.join(directory, 'file.json')
  await fs.writeFile(file, '{}')
  t.after(() => fs.rm(directory, { recursive: true, force: true }))

  await assert.rejects(
    sftpUploadFile(file, '', {}),
    /remoteFile must be a non-empty string/,
  )
})
