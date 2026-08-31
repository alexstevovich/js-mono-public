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
import anchoredMatcherPathexGscope from './vendor/anchored-matcher-pathex-gscope/index.js'
import pathToPosix from './vendor/path-to-posix/index.js'

/**
 * @param {string} rootDir
 * @param {{
 *   ignoreRuleFiles?: string[],
 *   globalIgnoreRules?: string[],
 *   pathTypes?: "ALL" | "FILE" | "DIR",
 *   recursive?: boolean,
 *   debug?: boolean,
 * }} options
 */
export default async function extrudeScanIgnoreGscope(
  rootDir,
  {
    ignoreRuleFiles = [],
    globalIgnoreRules = [],
    pathTypes = 'ALL',
    recursive = false,
    debug = false,
  } = {},
) {
  const matcher = await anchoredMatcherPathexGscope(rootDir, {
    pathexFiles: ignoreRuleFiles,
    globalPathexRules: globalIgnoreRules,
    debug,
  })

  const result = []
  const queue = [rootDir]
  const rootDepth = rootDir.split(path.sep).length

  while (queue.length) {
    const currentDir = queue.pop()
    const currentDepth = currentDir.split(path.sep).length

    // If not recursive and we're deeper than root, skip
    if (!recursive && currentDepth > rootDepth) continue

    const dirents = await fs.readdir(currentDir, { withFileTypes: true })

    for (const ent of dirents) {
      const abs = path.join(currentDir, ent.name)
      const rel = pathToPosix(path.relative(rootDir, abs))
      let isDir = ent.isDirectory()
      let isFile = ent.isFile()
      let isSymlink = ent.isSymbolicLink()
      let relForMatch = rel

      if (isSymlink) {
        try {
          const stat = await fs.stat(abs)
          isDir = stat.isDirectory()
          isFile = stat.isFile()
        } catch {
          continue
        }
      }

      if (isDir) {
        relForMatch += '/'
      }

      const isIgnored = matcher(relForMatch)
      if (isIgnored) continue

      const shouldInclude =
        pathTypes === 'ALL' ||
        (pathTypes === 'FILE' && isFile) ||
        (pathTypes === 'DIR' && isDir)

      if (shouldInclude) {
        result.push(relForMatch)
      }

      if (isDir && !isSymlink && recursive) {
        queue.push(abs)
      }
    }
  }

  return result
}
