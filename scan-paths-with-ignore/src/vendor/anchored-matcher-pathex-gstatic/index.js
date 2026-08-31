import { Minimatch } from 'minimatch'
import pathToPosix from '../path-to-posix/index.js'
import pathex_interpret from '../interpret-pathex/index.js'

const FORCE_DEBUG = false

export default function pathex_matcher_scoped_heuristic(
  patterns,
  baseRelPath = '',
  options = {},
) {
  const debug = options.debug || FORCE_DEBUG

  const includeRules = []
  const excludeRules = []

  if (debug)
    console.debug(`🧱 Normalizing patterns (baseRelPath="${baseRelPath}")`)
  for (const rawPattern of patterns) {
    const parsed = pathex_interpret(rawPattern)
    const mm = new Minimatch(parsed.pattern, {
      dot: true,
      matchBase: !parsed.pattern.includes('/'),
    })

    const rule = { matcher: mm, ...parsed }
    ;(parsed.isNegated ? includeRules : excludeRules).push(rule)
    if (debug)
      console.debug(
        `→ ${parsed.isNegated ? 'INCLUDE' : 'EXCLUDE'}: ${rawPattern} → ${parsed.pattern}`,
      )
  }

  const testMatch = (rule, fullPath, scopedPath, isDir) => {
    if (rule.directoryOnly && !isDir) return false

    const target = rule.anchored ? scopedPath : scopedPath

    if (
      rule.anchored &&
      scopedPath !== rule.pattern &&
      !scopedPath.startsWith(rule.pattern + '/')
    ) {
      return false
    }

    const result = rule.matcher.match(isDir ? `${target}/` : target)
    if (debug) {
      if (result) {
        console.debug(
          `✅ MATCHED: [${rule.raw}] against "${target}" (dir: ${isDir})`,
        )
      } else {
        console.debug(
          `❌ NOT matched: [${rule.raw}] against "${target}" (dir: ${isDir})`,
        )
      }
    }
    return result
  }

  const isPathIgnored = (inputPath, isDir) => {
    const posixPath = pathToPosix(inputPath).replace(/\/+$/, '')
    if (debug)
      console.debug(
        `\n📦 Evaluating: ${inputPath} → "${posixPath}" (dir: ${isDir})`,
      )

    // Scoped path (relative to baseRelPath)
    let scopedPath = posixPath
    if (baseRelPath !== '') {
      const prefix = pathToPosix(baseRelPath).replace(/\/+$/, '')
      if (posixPath === prefix) {
        scopedPath = ''
      } else if (posixPath.startsWith(prefix + '/')) {
        scopedPath = posixPath.slice(prefix.length + 1)
      } else {
        if (debug) console.debug('🟢 Outside baseRelPath — auto-include')
        return !true
      }
    }
    if (debug) console.debug(`📍 Scoped path: "${scopedPath}"`)

    const segments = scopedPath.split('/')

    for (let i = 1; i < segments.length; i++) {
      const parentPath = segments.slice(0, i).join('/')
      const parentExcluded = excludeRules.some((rule) =>
        testMatch(rule, posixPath, parentPath, true),
      )
      if (parentExcluded) {
        let restored = false
        for (let j = i; j <= segments.length; j++) {
          const subPath = segments.slice(0, j).join('/')
          const restoredBy = includeRules.some((rule) =>
            testMatch(
              rule,
              posixPath,
              subPath,
              j === segments.length ? isDir : true,
            ),
          )
          if (restoredBy) {
            if (j === segments.length) {
              if (debug)
                console.debug(
                  `✅ Restored by inclusion rule: matched ${subPath}`,
                )
              restored = true
            } else {
              // intermediate parent is restored — keep going
              continue
            }
            break
          }
        }
        if (!restored) {
          if (debug)
            console.debug(`⛔ Not restored — excluded (parent: ${parentPath})`)
          return !false
        }
        break
      }
    }

    // Step 2: Direct match
    const isIncluded = includeRules.some((rule) =>
      testMatch(rule, posixPath, scopedPath, isDir),
    )
    if (isIncluded) {
      if (debug) console.debug('✅ Directly included')
      return !true
    }

    const isExcluded = excludeRules.some((rule) =>
      testMatch(rule, posixPath, scopedPath, isDir),
    )
    if (isExcluded) {
      if (debug) console.debug('⛔ Directly excluded')
      return !false
    }

    if (debug) console.debug('🟢 Not excluded — included by default')
    return !true
  }

  return isPathIgnored
}
