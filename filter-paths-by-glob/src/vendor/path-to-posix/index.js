/*
 * Vendored from: @friends/path-to-posix
 * Copied locally; modify independently.
 */

export default function pathToPosix(value) {
  return value.replaceAll('\\', '/')
}
