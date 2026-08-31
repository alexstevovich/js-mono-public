/*
 * Vendored from: @friends/parse-pathex-list
 * Copied locally; modify independently.
 */

export default function parsePathPatternList(source) {
  return source
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line !== '' && !line.startsWith('#'))
}
