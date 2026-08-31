/*
 * MIT License
 *
 * Copyright (c) 2025 Alex Stevovich (https://alexstevovich.com)
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

const BINARY_EXTENSIONS = new Set([
  '.7z',
  '.aac',
  '.apk',
  '.app',
  '.avi',
  '.bin',
  '.bmp',
  '.bz2',
  '.deb',
  '.dll',
  '.doc',
  '.docx',
  '.dwg',
  '.dxf',
  '.exe',
  '.flac',
  '.flv',
  '.gif',
  '.gz',
  '.ico',
  '.jpeg',
  '.jpg',
  '.lz',
  '.lzma',
  '.m4a',
  '.mid',
  '.midi',
  '.mkv',
  '.mov',
  '.mp3',
  '.mp4',
  '.msi',
  '.ogg',
  '.otf',
  '.pdf',
  '.png',
  '.ppt',
  '.pptx',
  '.rar',
  '.rpm',
  '.svgz',
  '.tar',
  '.tif',
  '.tiff',
  '.ttf',
  '.wav',
  '.webm',
  '.webp',
  '.wmv',
  '.woff',
  '.woff2',
  '.xls',
  '.xlsx',
  '.xz',
  '.z',
  '.zip',
])

export default function hasBinaryExtension(
  filePath,
  extensions = BINARY_EXTENSIONS,
) {
  if (typeof filePath !== 'string') {
    throw new TypeError('filePath must be a string')
  }
  if (!extensions || typeof extensions.has !== 'function') {
    throw new TypeError('extensions must provide a has method')
  }

  return extensions.has(path.extname(filePath).toLowerCase())
}
