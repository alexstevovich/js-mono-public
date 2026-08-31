/*
 * MIT License
 *
 * Copyright (c) 2019 Alex Stevovich (https://alexstevovich.com)
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
import { imageSizeFromFile } from 'image-size/fromFile'

import {
  geometry,
  listFiles,
  normalizeExtensions,
  RASTER_EXTENSIONS,
  scanFiles,
  validateScanOptions,
} from './shared.js'

export async function readRasterGeometry(
  filePath,
  { pathname = path.basename(filePath) } = {},
) {
  const absolutePath = path.resolve(filePath)
  const [dimensions, stat] = await Promise.all([
    imageSizeFromFile(absolutePath),
    fs.stat(absolutePath),
  ])

  if (!stat.isFile()) throw new TypeError('filePath must identify a file')
  if (!dimensions?.width || !dimensions?.height) {
    throw new Error(`Unable to determine raster dimensions: ${filePath}`)
  }

  return geometry(
    pathname,
    dimensions.width,
    dimensions.height,
    dimensions.type ?? path.extname(filePath).slice(1).toLowerCase(),
    stat.size,
  )
}

export async function scanRasterGeometry(
  directory,
  { recursive = false, extensions = RASTER_EXTENSIONS, onError = 'skip' } = {},
) {
  validateScanOptions(recursive, onError)
  const allowed = normalizeExtensions(extensions, 'extensions')
  const files = await listFiles(directory, {
    recursive,
    accepts: (filePath) => allowed.has(path.extname(filePath).toLowerCase()),
  })
  return scanFiles(files, readRasterGeometry, onError)
}
