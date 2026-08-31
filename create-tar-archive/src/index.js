/*
 * ISC License
 *
 * Copyright (c) 2025 Alex Stevovich
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
 * REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
 * AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
 * LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
 * OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
 * PERFORMANCE OF THIS SOFTWARE.
 */

import fs from 'node:fs'
import path from 'node:path'
import { pipeline } from 'node:stream/promises'
import zlib from 'node:zlib'

import * as tar from 'tar'

const extensions = {
  none: '.tar',
  gzip: '.tar.gz',
  brotli: '.tar.br',
}

function normalizeCompression(compression) {
  if (compression === null || compression === 'none') return 'none'
  if (compression === 'gz' || compression === 'gzip') return 'gzip'
  if (compression === 'br' || compression === 'brotli') return 'brotli'
  throw new RangeError("compression must be 'gzip', 'brotli', or null")
}

export default async function createTarArchive(
  files,
  outputFile,
  { cwd = process.cwd(), compression = null, appendExtension = true } = {},
) {
  if (!Array.isArray(files) || files.length === 0) {
    throw new TypeError('files must be a non-empty array')
  }
  if (files.some((file) => typeof file !== 'string' || file.length === 0)) {
    throw new TypeError('every file must be a non-empty string')
  }
  if (typeof outputFile !== 'string' || outputFile.length === 0) {
    throw new TypeError('outputFile must be a non-empty string')
  }

  const archiveCompression = normalizeCompression(compression)
  const root = path.resolve(cwd)
  let archivePath = path.resolve(outputFile)
  const extension = extensions[archiveCompression]
  if (appendExtension && !archivePath.endsWith(extension)) {
    archivePath += extension
  }

  await Promise.all(
    files.map((file) => fs.promises.access(path.resolve(root, file))),
  )

  const archive = tar.c({ cwd: root, portable: true }, files)
  const output = fs.createWriteStream(archivePath)

  if (archiveCompression === 'gzip') {
    await pipeline(archive, zlib.createGzip(), output)
  } else if (archiveCompression === 'brotli') {
    await pipeline(archive, zlib.createBrotliCompress(), output)
  } else {
    await pipeline(archive, output)
  }

  return archivePath
}

export { createTarArchive }
