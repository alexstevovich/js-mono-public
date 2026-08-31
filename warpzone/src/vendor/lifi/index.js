/*
 * MIT License
 *
 * Copyright (c) 2015 Alex Stevovich (https://alexstevovich.com)
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

import fsSync from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'

function normalizeOptions(options) {
  const { recursive = false, extensions } = options

  if (extensions !== undefined && !Array.isArray(extensions)) {
    throw new TypeError('extensions must be an array')
  }
  if (extensions?.some((extension) => typeof extension !== 'string')) {
    throw new TypeError('extensions must contain only strings')
  }

  return { recursive: Boolean(recursive), extensions }
}

function matchesExtension(filePath, extensions) {
  return (
    !extensions?.length || extensions.some((value) => filePath.endsWith(value))
  )
}

export async function listFiles(directory, options = {}) {
  const normalized = normalizeOptions(options)
  const files = []

  async function visit(relativeDirectory) {
    const absoluteDirectory = path.join(directory, relativeDirectory)
    const entries = await fs.readdir(absoluteDirectory, { withFileTypes: true })
    entries.sort((left, right) => left.name.localeCompare(right.name))

    for (const entry of entries) {
      const relativePath = path.join(relativeDirectory, entry.name)
      if (
        entry.isFile() &&
        matchesExtension(relativePath, normalized.extensions)
      ) {
        files.push(relativePath)
      } else if (entry.isDirectory() && normalized.recursive) {
        await visit(relativePath)
      }
    }
  }

  await visit('')
  return files
}

export function listFilesSync(directory, options = {}) {
  const normalized = normalizeOptions(options)
  const files = []

  function visit(relativeDirectory) {
    const absoluteDirectory = path.join(directory, relativeDirectory)
    const entries = fsSync.readdirSync(absoluteDirectory, {
      withFileTypes: true,
    })
    entries.sort((left, right) => left.name.localeCompare(right.name))

    for (const entry of entries) {
      const relativePath = path.join(relativeDirectory, entry.name)
      if (
        entry.isFile() &&
        matchesExtension(relativePath, normalized.extensions)
      ) {
        files.push(relativePath)
      } else if (entry.isDirectory() && normalized.recursive) {
        visit(relativePath)
      }
    }
  }

  visit('')
  return files
}

export default listFiles
