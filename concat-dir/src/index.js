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

import fs from 'node:fs/promises'
import fsSync from 'node:fs'
import path from 'node:path'

function normalizeOptions({
  encoding = 'utf8',
  extensions,
  recursive = true,
  separator = '',
} = {}) {
  if (
    extensions !== undefined &&
    (!Array.isArray(extensions) ||
      extensions.some((extension) => typeof extension !== 'string'))
  ) {
    throw new TypeError('extensions must be an array of strings')
  }

  return {
    encoding,
    extensions: extensions?.map((extension) => extension.toLowerCase()),
    recursive,
    separator,
  }
}

function matchesExtension(name, extensions) {
  return (
    extensions === undefined ||
    extensions.some((extension) => name.toLowerCase().endsWith(extension))
  )
}

async function readDirectory(directory, options, contents) {
  const entries = await fs.readdir(directory, { withFileTypes: true })
  entries.sort((left, right) => left.name.localeCompare(right.name))

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name)

    if (entry.isDirectory() && options.recursive) {
      await readDirectory(entryPath, options, contents)
    } else if (
      entry.isFile() &&
      matchesExtension(entry.name, options.extensions)
    ) {
      contents.push(await fs.readFile(entryPath, options.encoding))
    }
  }
}

function readDirectorySync(directory, options, contents) {
  const entries = fsSync.readdirSync(directory, { withFileTypes: true })
  entries.sort((left, right) => left.name.localeCompare(right.name))

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name)

    if (entry.isDirectory() && options.recursive) {
      readDirectorySync(entryPath, options, contents)
    } else if (
      entry.isFile() &&
      matchesExtension(entry.name, options.extensions)
    ) {
      contents.push(fsSync.readFileSync(entryPath, options.encoding))
    }
  }
}

export default async function concatDir(directory, rawOptions) {
  const options = normalizeOptions(rawOptions)
  const contents = []
  await readDirectory(directory, options, contents)
  return contents.join(options.separator)
}

export function concatDirSync(directory, rawOptions) {
  const options = normalizeOptions(rawOptions)
  const contents = []
  readDirectorySync(directory, options, contents)
  return contents.join(options.separator)
}
