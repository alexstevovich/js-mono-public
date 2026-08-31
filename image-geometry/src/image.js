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

import path from 'node:path'

import { readRasterGeometry } from './raster.js'
import {
  listFiles,
  normalizeExtensions,
  RASTER_EXTENSIONS,
  scanFiles,
  validateScanOptions,
} from './shared.js'
import { readSvgGeometry } from './svg.js'

export function readImageGeometry(filePath, options) {
  return path.extname(filePath).toLowerCase() === '.svg'
    ? readSvgGeometry(filePath, options)
    : readRasterGeometry(filePath, options)
}

export async function scanImageGeometry(
  directory,
  {
    recursive = false,
    rasterExtensions = RASTER_EXTENSIONS,
    svgExtensions = ['.svg'],
    includeRaster = true,
    includeSvg = true,
    onError = 'skip',
  } = {},
) {
  validateScanOptions(recursive, onError)
  if (typeof includeRaster !== 'boolean' || typeof includeSvg !== 'boolean') {
    throw new TypeError('includeRaster and includeSvg must be booleans')
  }

  const raster = normalizeExtensions(rasterExtensions, 'rasterExtensions')
  const svg = normalizeExtensions(svgExtensions, 'svgExtensions')
  const files = await listFiles(directory, {
    recursive,
    accepts: (filePath) => {
      const extension = path.extname(filePath).toLowerCase()
      return (
        (includeRaster && raster.has(extension)) ||
        (includeSvg && svg.has(extension))
      )
    },
  })

  return scanFiles(
    files,
    (filePath, options) =>
      svg.has(path.extname(filePath).toLowerCase())
        ? readSvgGeometry(filePath, options)
        : readRasterGeometry(filePath, options),
    onError,
  )
}
