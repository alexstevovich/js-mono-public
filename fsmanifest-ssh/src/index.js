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

import SftpClient from 'ssh2-sftp-client'
import { Client as SshClient } from 'ssh2'

function normalizeRemotePath(value) {
  return value.replace(/\\/g, '/').replace(/\/+/g, '/')
}

function relativeRemotePath(root, entryPath) {
  root = normalizeRemotePath(root).replace(/\/$/, '')
  entryPath = normalizeRemotePath(entryPath)

  if (entryPath.startsWith(root + '/')) {
    return entryPath.slice(root.length + 1)
  }

  return entryPath
}

function normalizeMtimeMs(ms) {
  return Math.floor(ms / 1000) * 1000
}

function shellEscape(value) {
  return `'${String(value).replace(/'/g, `'\\''`)}'`
}

function connectSsh(config) {
  return new Promise((resolve, reject) => {
    const client = new SshClient()

    client
      .once('ready', () => resolve(client))
      .once('error', reject)
      .connect(config)
  })
}

function execSsh(client, command) {
  return new Promise((resolve, reject) => {
    client.exec(command, (error, stream) => {
      if (error) {
        reject(error)
        return
      }

      let stdout = ''
      let stderr = ''

      stream.on('data', (data) => {
        stdout += data.toString()
      })

      stream.stderr.on('data', (data) => {
        stderr += data.toString()
      })

      stream.on('close', (code) => {
        if (code !== 0) {
          reject(
            new Error(
              `SSH command failed with code ${code}` +
                (stderr ? `: ${stderr.trim()}` : ''),
            ),
          )

          return
        }

        resolve(stdout)
      })
    })
  })
}

async function remoteHash(ssh, filePath) {
  const command = `sha256sum -- ${shellEscape(filePath)}`

  const output = await execSsh(ssh, command)

  return output.trim().split(/\s+/)[0]
}

async function remoteLinkTarget(ssh, linkPath) {
  const command = `readlink -- ${shellEscape(linkPath)}`

  const output = await execSsh(ssh, command)

  return output.trim()
}

export default async function remoteDirManifest(
  directory = '.',
  connection = {},
  options = {},
) {
  const {
    recursive = false,

    files = true,
    dirs = true,
    links = true,

    size = false,
    mtimeMs = false,
    hash = false,
    missing = 'error',
    logging = false,
  } = options

  if (missing !== 'error' && missing !== 'empty') {
    throw new TypeError('missing must be either "error" or "empty"')
  }

  const root = normalizeRemotePath(directory).replace(/\/$/, '')

  const sftp = new SftpClient()
  let ssh = null

  const records = []

  function log(...args) {
    if (logging) {
      console.log('[remote-dir-manifest]', ...args)
    }
  }

  try {
    log('Connecting SFTP...')

    await sftp.connect(connection)

    log('SFTP connected')

    /*
     * SSH is needed for:
     *
     * - hashing files
     * - resolving symlink targets
     */
    if (hash || links) {
      log('Connecting SSH...')

      ssh = await connectSsh(connection)

      log('SSH connected')
    }

    async function scan(currentDirectory) {
      log('Scanning', currentDirectory)

      const entries = await sftp.list(currentDirectory)

      for (const entry of entries) {
        const remotePath = normalizeRemotePath(
          `${currentDirectory}/${entry.name}`,
        )

        const entryPath = relativeRemotePath(root, remotePath)

        /*
         * Directory
         */
        if (entry.type === 'd') {
          if (dirs) {
            const record = {
              path: entryPath,
              type: 'dir',
            }

            if (mtimeMs) {
              record.mtimeMs = normalizeMtimeMs(entry.modifyTime)
            }

            records.push(record)

            log('Dir', record)
          }

          if (recursive) {
            await scan(remotePath)
          }

          continue
        }

        /*
         * Symlink
         *
         * Links are recorded but never followed.
         */
        if (entry.type === 'l') {
          if (links) {
            const record = {
              path: entryPath,
              type: 'link',
              target: await remoteLinkTarget(ssh, remotePath),
            }

            if (mtimeMs) {
              record.mtimeMs = normalizeMtimeMs(entry.modifyTime)
            }

            records.push(record)

            log('Link', record)
          }

          continue
        }

        /*
         * Ignore anything that isn't a normal file.
         */
        if (entry.type !== '-') {
          continue
        }

        /*
         * File
         */
        if (!files) {
          continue
        }

        const record = {
          path: entryPath,
          type: 'file',
        }

        if (size) {
          record.size = entry.size
        }

        if (mtimeMs) {
          record.mtimeMs = normalizeMtimeMs(entry.modifyTime)
        }

        if (hash) {
          log('Hashing', record.path)

          record.hash = await remoteHash(ssh, remotePath)
        }

        records.push(record)

        log('File', record)
      }
    }

    const rootType = await sftp.exists(root)

    if (rootType === false) {
      if (missing === 'error') {
        const error = new Error(`Remote directory does not exist: ${root}`)

        error.code = 'ENOENT'
        throw error
      }

      log('Directory does not exist; returning an empty manifest')
    } else if (rootType !== 'd') {
      throw new Error(`Remote manifest root is not a directory: ${root}`)
    } else {
      await scan(root)
    }

    records.sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0))

    log(`Done: ${records.length} entries`)

    return records
  } finally {
    if (ssh) {
      log('Closing SSH')
      ssh.end()
    }

    log('Closing SFTP')

    await sftp.end()
  }
}
