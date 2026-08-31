/*
 * Vendored from: @alexstevovich/create-path-tree
 * Copied locally; modify independently.
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import { Minimatch } from 'minimatch'

function posix(value) {
  return value.replaceAll('\\', '/')
}

function parseRules(source) {
  return source
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
}

function createMatcher(patterns) {
  const rules = patterns.map((raw) => {
    const negated = raw.startsWith('!')
    let pattern = negated ? raw.slice(1) : raw
    const directoryOnly = pattern.endsWith('/')
    pattern = pattern.replace(/^\//, '').replace(/\/$/, '')
    return {
      directoryOnly,
      negated,
      matcher: new Minimatch(pattern, {
        dot: true,
        matchBase: !pattern.includes('/'),
      }),
    }
  })

  return (relativePath, directory) => {
    const candidate = posix(relativePath).replace(/\/$/, '')
    let ignored = false
    for (const rule of rules) {
      if (rule.directoryOnly && !directory) continue
      if (rule.matcher.match(candidate)) ignored = !rule.negated
    }
    return ignored
  }
}

class PathTreeNode {
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
    this.totalBytes = null
  }

  isDirectory() {
    return this.type === 'directory'
  }

  isFile() {
    return this.type === 'file'
  }

  get sizeBytes() {
    return this.isFile() ? this.stats.size : 0
  }

  relativePath() {
    let root = this
    while (root.parent) root = root.parent
    const relative = posix(path.relative(root.path, this.path))
    return this.isDirectory() && relative ? `${relative}/` : relative
  }

  async getTotalBytes() {
    if (this.totalBytes !== null) return this.totalBytes
    if (!this.isDirectory()) this.totalBytes = this.sizeBytes
    else {
      const sizes = await Promise.all(
        this.children.map((child) => child.getTotalBytes()),
      )
      this.totalBytes = sizes.reduce((sum, size) => sum + size, 0)
    }
    return this.totalBytes
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

async function loadRules(rootPath, filenames) {
  const rules = []
  for (const filename of filenames) {
    try {
      rules.push(
        ...parseRules(await fs.readFile(path.join(rootPath, filename), 'utf8')),
      )
    } catch (error) {
      if (error.code !== 'ENOENT') throw error
    }
  }
  return rules
}

export default async function createPathTree(
  target,
  { depth = Infinity, ignoreRuleFiles = [], globalIgnoreRules = [] } = {},
) {
  if (depth !== Infinity && (!Number.isInteger(depth) || depth < 0)) {
    throw new RangeError('depth must be a non-negative integer or Infinity')
  }
  const absolutePath = path.resolve(target)
  const root = await buildNode(absolutePath, null, 0, depth)
  const matcher = createMatcher([
    ...globalIgnoreRules,
    ...(await loadRules(absolutePath, ignoreRuleFiles)),
  ])

  const visit = (node) => {
    node.ignored =
      node === root ? false : matcher(node.relativePath(), node.isDirectory())
    node.children.forEach(visit)
  }
  visit(root)
  return root
}
