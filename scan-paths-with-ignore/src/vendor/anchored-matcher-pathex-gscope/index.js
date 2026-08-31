import fs from 'node:fs/promises'
import path from 'node:path'
import loadScopedPathexDocs from '../load-scoped-pathex-files/index.js'
import anchoredMatcherPathexGStatic from '../anchored-matcher-pathex-gstatic/index.js'
import pathToPosix from '../path-to-posix/index.js'

/* STYLE1
export default async function matcher(rootDir, options = {}) {
  const matcher = new FileMatcherPathexScoped(rootDir, options);
  await matcher.init()
  return matcher;

}
*/

export default async function matcher(rootDir, options = {}) {
  const matcher = new FileMatcherPathexScoped(rootDir, options)
  await matcher.init()
  const fn = (path) => {
    return matcher.match(path)
  }
  fn.obj = matcher
  return fn
}

class FileMatcherPathexScoped {
  constructor(
    rootDir,
    { pathexFiles = [], globalPathexRules = [], debug = false } = {},
  ) {
    this.rootDir = path.resolve(rootDir)
    this.pathexFiles = Array.isArray(pathexFiles) ? pathexFiles : [pathexFiles]
    this.globalPathexRules = globalPathexRules
    this.debug = debug
    this.hierarchy = new Map()
  }

  async init() {
    const queue = [this.rootDir]

    while (queue.length) {
      const currentDir = queue.pop()
      const relPath = path.relative(this.rootDir, currentDir)
      const parentDir = path.dirname(currentDir)
      const parentMatcher = this.hierarchy.get(parentDir)
      const parentPatterns = parentMatcher?.__patterns || []

      const localPatterns = await loadScopedPathexDocs(
        currentDir,
        this.pathexFiles,
      )

      if (this.debug) {
        console.debug(`📂 Building matcher for: ${currentDir}`)
        console.debug(`├─ inherited: ${parentPatterns.length} patterns`)
        console.debug(`├─ local: ${localPatterns.length} patterns`)
        if (relPath === '') {
          console.debug(
            `├─ + global rules: ${this.globalPathexRules.length} patterns`,
          )
        }
      }

      const allPatterns = [
        ...parentPatterns,
        ...localPatterns,
        ...(relPath === '' ? this.globalPathexRules : []),
      ]

      const matcher = anchoredMatcherPathexGStatic(allPatterns, '', {
        debug: this.debug,
      })
      matcher.__patterns = allPatterns
      this.hierarchy.set(currentDir, matcher)

      const dirents = await fs.readdir(currentDir, { withFileTypes: true })
      for (const ent of dirents) {
        if (ent.isSymbolicLink()) continue // ✅ Skip symlinks

        const childPath = path.join(currentDir, ent.name)
        const relChildPath = path.relative(this.rootDir, childPath)
        const isDir = ent.isDirectory()

        let isIgnored = matcher(relChildPath, isDir)

        if (isDir && isIgnored) {
          const restored = matcher.__patterns.some(
            (pattern) =>
              pattern.negated &&
              pattern.pattern.startsWith(pathToPosix(relChildPath) + '/'),
          )
          if (restored) isIgnored = false
        }

        if (isDir && !isIgnored) queue.push(childPath)
      }
    }
  }

  match(relPath) {
    relPath = pathToPosix(relPath)

    const isDir = relPath.endsWith('/')

    let checkDir = this.rootDir
    const parts = relPath.split('/')

    // Remove the empty trailing part if it's a directory path ending with '/'
    const loopUntil = isDir ? parts.length - 1 : parts.length - 1
    for (let i = 0; i < loopUntil; i++) {
      checkDir = path.join(checkDir, parts[i])
    }

    if (this.debug) {
      console.debug(`\n🎯 MATCHING: ${relPath} (${isDir ? 'dir' : 'file'})`)
    }

    while (checkDir && checkDir !== path.dirname(checkDir)) {
      const matcher = this.hierarchy.get(checkDir)
      if (this.debug) {
        console.debug(`├─ Checking matcher for ${checkDir}`)
      }
      if (matcher) {
        return matcher(relPath, isDir)
      }
      checkDir = path.dirname(checkDir)
    }

    return false
  }

  dir(relPath) {
    return this.match(relPath, true)
  }

  file(relPath) {
    return this.match(relPath, false)
  }

  toString() {
    return `[FileMatcher from ${this.rootDir}]`
  }
}
