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

import fs from 'node:fs/promises'
import path from 'node:path'

import parsePathPatternList from '../parse-pathex-list/index.js'

export default async function loadPathPatternFiles(directory, filenames = []) {
  const names = typeof filenames === 'string' ? [filenames] : filenames
  if (!Array.isArray(names)) {
    throw new TypeError('filenames must be a string or an array')
  }

  const patterns = []
  for (const filename of names) {
    try {
      const source = await fs.readFile(path.join(directory, filename), 'utf8')
      patterns.push(...parsePathPatternList(source))
    } catch {
      // These files are optional by design.
    }
  }
  return patterns
}
