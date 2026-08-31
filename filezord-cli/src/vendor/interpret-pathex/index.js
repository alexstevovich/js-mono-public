export default function interpretPathex(pattern) {
  const isNegated = pattern.startsWith('!')
  const raw = isNegated ? pattern.slice(1) : pattern

  const anchored = raw.startsWith('/')
  const directoryOnly = raw.endsWith('/')

  let normalized = raw
  if (anchored) normalized = normalized.slice(1)
  if (directoryOnly) normalized = normalized.slice(0, -1)

  return {
    pattern: normalized,
    isNegated,
    anchored,
    directoryOnly,
    raw,
  }
}
