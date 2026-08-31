import assert from 'node:assert/strict'
import test from 'node:test'

import sftpDownloadFile from '../src/index.js'

test('rejects empty paths before connecting', async () => {
  await assert.rejects(
    sftpDownloadFile('', 'download.json', {}),
    /remoteFile must be a non-empty string/,
  )
  await assert.rejects(
    sftpDownloadFile('/remote/file.json', '', {}),
    /localFile must be a non-empty string/,
  )
})
