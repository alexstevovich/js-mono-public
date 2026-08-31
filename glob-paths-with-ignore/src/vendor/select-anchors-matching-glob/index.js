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

import path from 'node:path'

import micromatch from 'micromatch'

import pathToPosix from '../path-to-posix/index.js'

export default function filterPathsByGlob(
  baseDirectory,
  paths,
  patterns,
  { dot = true } = {},
) {
  if (!baseDirectory) {
    throw new Error('baseDirectory is required')
  }

  const patternList = Array.isArray(patterns) ? patterns : [patterns]
  if (patternList.length === 0) {
    return []
  }

  const originalsByRelativePath = new Map()
  for (const original of paths) {
    const absolute = path.isAbsolute(original)
      ? original
      : path.resolve(baseDirectory, original)
    const relative = pathToPosix(path.relative(baseDirectory, absolute))
    const originals = originalsByRelativePath.get(relative) ?? []
    originals.push(original)
    originalsByRelativePath.set(relative, originals)
  }

  return micromatch([...originalsByRelativePath.keys()], patternList, {
    dot,
  }).flatMap((relative) => originalsByRelativePath.get(relative))
}
