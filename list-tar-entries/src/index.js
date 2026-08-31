/*
 * Copyright 2016 Alex Stevovich
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import fs from 'node:fs'
import path from 'node:path'
import { pipeline } from 'node:stream/promises'
import zlib from 'node:zlib'

import * as tar from 'tar'

function decompressorFor(filename) {
  if (filename.endsWith('.gz') || filename.endsWith('.tgz')) {
    return zlib.createGunzip()
  }
  if (filename.endsWith('.br')) return zlib.createBrotliDecompress()
  return null
}

export default async function listTarEntries(archivePath) {
  if (typeof archivePath !== 'string' || archivePath.length === 0) {
    throw new TypeError('archivePath must be a non-empty string')
  }

  const filename = path.resolve(archivePath)
  const entries = []
  const parser = tar.t({
    strict: true,
    onentry(entry) {
      entries.push(entry.path)
    },
  })
  const input = fs.createReadStream(filename)
  const decompressor = decompressorFor(filename)

  if (decompressor) await pipeline(input, decompressor, parser)
  else await pipeline(input, parser)

  return entries
}

export { listTarEntries }
