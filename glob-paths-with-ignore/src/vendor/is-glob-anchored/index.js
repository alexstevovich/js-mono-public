import pathToPosix from '../path-to-posix/index.js'

/**
 * Determines whether a glob pattern is "safe" by ensuring
 * it does not attempt to traverse upward in the directory hierarchy (e.g. '../').
 *
 * This is useful when sandboxing glob behavior to prevent reaching outside
 * of expected file scopes.
 *
 * @param {string} pattern - The glob pattern to check.
 * @returns {boolean} True if the pattern is safe (no backsteps), false if it escapes upward.
 */
export default function isGlobAnchored(pattern) {
  const posix = pathToPosix(pattern)
  return !posix.split('/').some((part) => part === '..')
}
