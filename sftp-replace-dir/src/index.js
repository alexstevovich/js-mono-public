/*
 * MIT License
 *
 * Copyright (c) 2026 Alex Stevovich (https://alexstevovich.com)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import fs from 'node:fs/promises'
import path from 'node:path'

import SftpClient from 'ssh2-sftp-client'

function normalizeRemoteDirectory(value) {
  if (typeof value !== 'string') {
    throw new TypeError('remoteDirectory must be a string')
  }

  const normalized = value.replace(/\\/g, '/').replace(/\/+$/g, '')

  if (
    normalized === '' ||
    normalized === '.' ||
    normalized === '..' ||
    normalized === '/'
  ) {
    throw new Error(`Refusing to replace unsafe remote directory: ${value}`)
  }

  return normalized
}

export default async function replaceRemoteDirectory(
  localDirectory,
  remoteDirectory,
  connection,
  options = {},
) {
  const { logging = false, useFastput = false } = options

  const localPath = path.resolve(localDirectory)
  const remotePath = normalizeRemoteDirectory(remoteDirectory)
  const stat = await fs.stat(localPath)

  if (!stat.isDirectory()) {
    throw new Error(`Local source is not a directory: ${localPath}`)
  }

  const sftp = new SftpClient()
  let connected = false

  if (logging) {
    sftp.on('upload', ({ source, destination }) => {
      console.log('[sftp-replace-dir] Uploaded', source, '->', destination)
    })
  }

  try {
    await sftp.connect(connection)
    connected = true

    const remoteType = await sftp.exists(remotePath)

    if (remoteType && remoteType !== 'd') {
      throw new Error(`Remote destination is not a directory: ${remotePath}`)
    }

    if (remoteType === 'd') {
      if (logging) {
        console.log('[sftp-replace-dir] Removing', remotePath)
      }

      await sftp.rmdir(remotePath, true)
    }

    if (logging) {
      console.log('[sftp-replace-dir] Uploading', localPath, '->', remotePath)
    }

    await sftp.uploadDir(localPath, remotePath, { useFastput })

    return remotePath
  } finally {
    if (connected) {
      await sftp.end()
    }
  }
}
