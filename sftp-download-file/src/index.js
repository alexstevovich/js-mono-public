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

export default async function sftpDownloadFile(
  remoteFile,
  localFile,
  connection,
) {
  if (typeof remoteFile !== 'string' || remoteFile.length === 0) {
    throw new TypeError('remoteFile must be a non-empty string')
  }

  if (typeof localFile !== 'string' || localFile.length === 0) {
    throw new TypeError('localFile must be a non-empty string')
  }

  await fs.mkdir(path.dirname(path.resolve(localFile)), { recursive: true })

  const sftp = new SftpClient()
  let connected = false

  try {
    await sftp.connect(connection)
    connected = true
    await sftp.get(remoteFile, localFile)
    return localFile
  } finally {
    if (connected) {
      await sftp.end()
    }
  }
}
