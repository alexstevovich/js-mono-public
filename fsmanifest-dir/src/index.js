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
import fsSync from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

function hashFile(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256')
    const stream = fsSync.createReadStream(filePath)

    stream.on('error', reject)
    stream.on('data', (chunk) => hash.update(chunk))
    stream.on('end', () => resolve(hash.digest('hex')))
  })
}

function normalizeMtimeMs(ms) {
  return Math.floor(ms / 1000) * 1000
}

export default async function createDirectoryManifest(
  directory = '.',
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
    logging = false,
  } = options

  const root = path.resolve(directory)
  const records = []

  function log(...args) {
    if (logging) {
      console.log('[dir-manifest]', ...args)
    }
  }

  function relativePath(absolutePath) {
    return path.relative(root, absolutePath).split(path.sep).join('/')
  }

  async function scan(currentDirectory) {
    log('Scanning', currentDirectory)

    const entries = await fs.readdir(currentDirectory, {
      withFileTypes: true,
    })

    for (const entry of entries) {
      const absolutePath = path.join(currentDirectory, entry.name)

      const entryPath = relativePath(absolutePath)

      /*
       * Directory
       */
      if (entry.isDirectory()) {
        if (dirs) {
          const record = {
            path: entryPath,
            type: 'dir',
          }

          if (mtimeMs) {
            const stat = await fs.lstat(absolutePath)

            record.mtimeMs = normalizeMtimeMs(stat.mtimeMs)
          }

          records.push(record)

          log('Dir', record)
        }

        if (recursive) {
          await scan(absolutePath)
        }

        continue
      }

      /*
       * Symlink
       *
       * Links are recorded but never followed.
       */
      if (entry.isSymbolicLink()) {
        if (links) {
          const record = {
            path: entryPath,
            type: 'link',
            target: await fs.readlink(absolutePath),
          }

          if (mtimeMs) {
            const stat = await fs.lstat(absolutePath)

            record.mtimeMs = normalizeMtimeMs(stat.mtimeMs)
          }

          records.push(record)

          log('Link', record)
        }

        continue
      }

      /*
       * Ignore anything that isn't a normal file.
       */
      if (!entry.isFile()) {
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

      if (size || mtimeMs) {
        const stat = await fs.lstat(absolutePath)

        if (size) {
          record.size = stat.size
        }

        if (mtimeMs) {
          record.mtimeMs = normalizeMtimeMs(stat.mtimeMs)
        }
      }

      if (hash) {
        log('Hashing', record.path)

        record.hash = await hashFile(absolutePath)
      }

      records.push(record)

      log('File', record)
    }
  }

  await scan(root)

  records.sort((a, b) => a.path.localeCompare(b.path))

  log(`Done: ${records.length} entries`)

  return records
}
