/*
 * strdir
 *
 * Copyright (c) 2015 Alex Stevovich
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import fs from 'node:fs/promises'
import fsSync from 'node:fs'
import path from 'node:path'

export async function stringDir(dir, { extensions, encoding = 'utf8' } = {}) {
  const entries = await fs.readdir(dir, { withFileTypes: true })

  let combined = ''

  // Iterate over entries and process files and subdirectories
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      // Recursively process subdirectories
      combined += await stringDir(fullPath, { extensions, encoding })
    } else if (
      entry.isFile() &&
      (!extensions ||
        extensions.some((ext) =>
          entry.name.toLowerCase().endsWith(ext.toLowerCase()),
        ))
    ) {
      // Read file if it matches extensions
      const content = await fs.readFile(fullPath, encoding)
      combined += content
    }
  }

  return combined.trim()
}

export function stringDirSync(dir, { extensions, encoding = 'utf8' } = {}) {
  const entries = fsSync.readdirSync(dir, { withFileTypes: true })

  let combined = ''

  // Iterate over entries and process files and subdirectories
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      // Recursively process subdirectories
      combined += stringDirSync(fullPath, { extensions, encoding })
    } else if (
      entry.isFile() &&
      (!extensions ||
        extensions.some((ext) =>
          entry.name.toLowerCase().endsWith(ext.toLowerCase()),
        ))
    ) {
      // Read file if it matches extensions
      const content = fsSync.readFileSync(fullPath, encoding)
      combined += content
    }
  }

  return combined.trim()
}

export default stringDir
