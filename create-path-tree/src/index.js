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

import createScopedPathIgnoreMatcher from './vendor/anchored-matcher-pathex-gscope/index.js'
import pathToPosix from './vendor/path-to-posix/index.js'

function resolveDepth({ depth, recursive }) {
  if (depth !== undefined) {
    if (depth !== Infinity && (!Number.isInteger(depth) || depth < 0)) {
      throw new RangeError('depth must be a non-negative integer or Infinity')
    }
    return depth
  }

  if (recursive !== undefined) {
    if (typeof recursive !== 'boolean') {
      throw new TypeError('recursive must be a boolean')
    }
    return recursive ? Infinity : 0
  }

  return Infinity
}

export class PathTreeNode {
  constructor(absolutePath, stats, parent = null) {
    this.path = absolutePath
    this.name = path.basename(absolutePath)
    this.parent = parent
    this.children = []
    this.stats = stats
    this.type = stats.isSymbolicLink()
      ? 'symlink'
      : stats.isDirectory()
        ? 'directory'
        : 'file'
    this.ignored = false
    this._totalBytes = null
  }

  isDirectory() {
    return this.type === 'directory'
  }

  isFile() {
    return this.type === 'file'
  }

  isSymbolicLink() {
    return this.type === 'symlink'
  }

  get sizeBytes() {
    return this.isFile() ? this.stats.size : 0
  }

  async getTotalBytes() {
    if (this._totalBytes !== null) return this._totalBytes

    if (!this.isDirectory()) {
      this._totalBytes = this.sizeBytes
      return this._totalBytes
    }

    const sizes = await Promise.all(
      this.children.map((child) => child.getTotalBytes()),
    )
    this._totalBytes = sizes.reduce((total, size) => total + size, 0)
    return this._totalBytes
  }

  async walk(visitor) {
    if (typeof visitor !== 'function') {
      throw new TypeError('visitor must be a function')
    }

    await visitor(this)
    for (const child of this.children) await child.walk(visitor)
  }

  flatten() {
    return [this, ...this.children.flatMap((child) => child.flatten())]
  }

  relativePath(root = this.root) {
    const relative = pathToPosix(path.relative(root.path, this.path))
    return this.isDirectory() && relative ? `${relative}/` : relative
  }

  get root() {
    let node = this
    while (node.parent) node = node.parent
    return node
  }
}

async function buildNode(absolutePath, parent, depth, depthLimit) {
  const stats = await fs.lstat(absolutePath)
  const node = new PathTreeNode(absolutePath, stats, parent)

  if (!node.isDirectory() || depth >= depthLimit) return node

  const entries = await fs.readdir(absolutePath)
  node.children = await Promise.all(
    entries.map((entry) =>
      buildNode(path.join(absolutePath, entry), node, depth + 1, depthLimit),
    ),
  )
  return node
}

async function markIgnoredNodes(
  root,
  { ignoreRuleFiles, globalIgnoreRules, debug },
) {
  if (ignoreRuleFiles.length === 0 && globalIgnoreRules.length === 0) return

  const matcher = await createScopedPathIgnoreMatcher(root.path, {
    pathexFiles: ignoreRuleFiles,
    globalPathexRules: globalIgnoreRules,
    debug,
  })

  await root.walk((node) => {
    node.ignored = node === root ? false : matcher(node.relativePath(root))
  })
}

export async function createPathTree(
  target,
  {
    depth,
    recursive,
    ignoreRuleFiles = [],
    globalIgnoreRules = [],
    debug = false,
  } = {},
) {
  if (typeof target !== 'string' || target.length === 0) {
    throw new TypeError('target must be a non-empty string')
  }
  if (!Array.isArray(ignoreRuleFiles) || !Array.isArray(globalIgnoreRules)) {
    throw new TypeError('ignore rules must be arrays')
  }

  const absolutePath = path.resolve(target)
  const root = await buildNode(
    absolutePath,
    null,
    0,
    resolveDepth({
      depth,
      recursive,
    }),
  )

  await markIgnoredNodes(root, {
    ignoreRuleFiles,
    globalIgnoreRules,
    debug,
  })

  return root
}

export default createPathTree
