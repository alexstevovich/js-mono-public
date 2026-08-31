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

import {
  geometry,
  listFiles,
  normalizeExtensions,
  scanFiles,
  validateScanOptions,
} from './shared.js'

function parseLength(value) {
  const match = value?.trim().match(/^(\d+(?:\.\d+)?|\.\d+)(?:px)?$/i)
  return match ? Number(match[1]) : undefined
}

function parseSvgDimensions(content) {
  const tag = content.match(/<svg\b[^>]*>/i)?.[0]
  if (!tag) throw new Error('File does not contain an SVG root element')

  const attributes = new Map()
  for (const match of tag.matchAll(/([:\w-]+)\s*=\s*(['"])(.*?)\2/g)) {
    attributes.set(match[1].toLowerCase(), match[3])
  }

  let width = parseLength(attributes.get('width'))
  let height = parseLength(attributes.get('height'))
  const viewBox = attributes
    .get('viewbox')
    ?.trim()
    .split(/[\s,]+/)
    .map(Number)

  if (viewBox?.length === 4 && viewBox.every(Number.isFinite)) {
    const viewBoxWidth = viewBox[2]
    const viewBoxHeight = viewBox[3]
    if (viewBoxWidth > 0 && viewBoxHeight > 0) {
      if (!width && !height) {
        width = viewBoxWidth
        height = viewBoxHeight
      } else if (!width) {
        width = (height * viewBoxWidth) / viewBoxHeight
      } else if (!height) {
        height = (width * viewBoxHeight) / viewBoxWidth
      }
    }
  }

  if (!width || !height) {
    throw new Error('Unable to determine SVG dimensions')
  }
  return { width, height }
}

export async function readSvgGeometry(
  filePath,
  { pathname = path.basename(filePath) } = {},
) {
  const absolutePath = path.resolve(filePath)
  const [content, stat] = await Promise.all([
    fs.readFile(absolutePath, 'utf8'),
    fs.stat(absolutePath),
  ])
  if (!stat.isFile()) throw new TypeError('filePath must identify a file')

  const { width, height } = parseSvgDimensions(content)
  return geometry(pathname, width, height, 'svg', stat.size)
}

export async function scanSvgGeometry(
  directory,
  { recursive = false, extensions = ['.svg'], onError = 'skip' } = {},
) {
  validateScanOptions(recursive, onError)
  const allowed = normalizeExtensions(extensions, 'extensions')
  const files = await listFiles(directory, {
    recursive,
    accepts: (filePath) => allowed.has(path.extname(filePath).toLowerCase()),
  })
  return scanFiles(files, readSvgGeometry, onError)
}
