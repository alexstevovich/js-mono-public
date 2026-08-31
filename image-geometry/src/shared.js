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

export const RASTER_EXTENSIONS = Object.freeze([
  '.avif',
  '.bmp',
  '.gif',
  '.heic',
  '.ico',
  '.jpeg',
  '.jpg',
  '.png',
  '.tif',
  '.tiff',
  '.webp',
])

export function geometry(pathname, width, height, format, bytes) {
  return {
    path: pathname.replaceAll('\\', '/'),
    width,
    height,
    aspectRatio: `${width}/${height}`,
    orientation:
      width === height ? 'square' : width > height ? 'landscape' : 'portrait',
    format,
    filesize: bytes,
  }
}

export function normalizeExtensions(extensions, name) {
  if (
    !Array.isArray(extensions) ||
    extensions.some((extension) => typeof extension !== 'string')
  ) {
    throw new TypeError(`${name} must be an array of strings`)
  }

  return new Set(
    extensions.map((extension) => {
      const normalized = extension.toLowerCase()
      return normalized.startsWith('.') ? normalized : `.${normalized}`
    }),
  )
}

export function validateScanOptions(recursive, onError) {
  if (typeof recursive !== 'boolean') {
    throw new TypeError('recursive must be a boolean')
  }
  if (onError !== 'throw' && onError !== 'skip') {
    throw new RangeError("onError must be 'throw' or 'skip'")
  }
}

export async function listFiles(directory, { recursive, accepts }) {
  const root = path.resolve(directory)
  const stat = await fs.stat(root)
  if (!stat.isDirectory()) {
    throw new TypeError('directory must identify a directory')
  }

  const files = []

  async function visit(current) {
    const entries = await fs.readdir(current, { withFileTypes: true })
    entries.sort((left, right) => left.name.localeCompare(right.name))

    for (const entry of entries) {
      const fullPath = path.join(current, entry.name)
      if (entry.isDirectory()) {
        if (recursive) await visit(fullPath)
      } else if (entry.isFile() && accepts(fullPath)) {
        files.push({
          fullPath,
          relativePath: path.relative(root, fullPath).replaceAll('\\', '/'),
        })
      }
    }
  }

  await visit(root)
  return files
}

export async function scanFiles(files, reader, onError) {
  const results = []

  for (const { fullPath, relativePath } of files) {
    try {
      results.push(await reader(fullPath, { pathname: relativePath }))
    } catch (error) {
      if (onError === 'throw') throw error
    }
  }

  return results
}
