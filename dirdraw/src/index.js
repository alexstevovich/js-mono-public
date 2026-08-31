/*
 * ISC License
 * Copyright (c) 2025 Alex Stevovich
 */

import createPathTree from './vendor/create-path-tree/index.js'

const strokes = {
  1: { vertical: '│', horizontal: '──', branch: '├', corner: '└' },
  2: { vertical: '║', horizontal: '══', branch: '╠', corner: '╚' },
  3: { vertical: '┃', horizontal: '━━', branch: '┣', corner: '┗' },
}

function normalizeIgnoreMode(value, name) {
  const mode = value.toLowerCase()
  if (!['hide', 'redact', 'seal'].includes(mode)) {
    throw new RangeError(`${name} must be hide, redact, or seal`)
  }
  return mode
}

function toDisplayNode(node, sizeMode, ignoredDirectoryMode, ignoredFileMode) {
  const directory = node.isDirectory()
  const ignoreMode = directory ? ignoredDirectoryMode : ignoredFileMode
  if (node.ignored && ignoreMode === 'hide') return null

  const displayNode = {
    path: node.relativePath() || node.name,
    type: directory ? 'directory' : 'file',
    display: node.ignored ? ignoreMode : 'show',
  }

  if (sizeMode === 'files' && node.isFile()) displayNode.size = node.sizeBytes
  if (sizeMode === 'total') displayNode.size = node.totalBytes
  if (node.ignored && ignoreMode === 'redact') displayNode.path = '********'

  if (directory && !(node.ignored && ignoreMode === 'seal')) {
    const children = node.children
      .map((child) =>
        toDisplayNode(child, sizeMode, ignoredDirectoryMode, ignoredFileMode),
      )
      .filter(Boolean)
    if (children.length > 0) displayNode.children = children
  }

  return displayNode
}

export async function createDirectoryTreeData(
  target = '.',
  {
    depth = Infinity,
    ignoreRuleFiles = [],
    globalIgnoreRules = [],
    sizeMode = null,
    ignoredDirectoryMode = 'seal',
    ignoredFileMode = 'redact',
  } = {},
) {
  const normalizedSizeMode = sizeMode?.toLowerCase() ?? null
  if (![null, 'files', 'total'].includes(normalizedSizeMode)) {
    throw new RangeError('sizeMode must be files, total, or null')
  }

  const tree = await createPathTree(target, {
    depth,
    ignoreRuleFiles,
    globalIgnoreRules,
  })
  if (normalizedSizeMode === 'total') await tree.getTotalBytes()

  return toDisplayNode(
    tree,
    normalizedSizeMode,
    normalizeIgnoreMode(ignoredDirectoryMode, 'ignoredDirectoryMode'),
    normalizeIgnoreMode(ignoredFileMode, 'ignoredFileMode'),
  )
}

function renderNode(node, prefix, last, stroke) {
  const connector = prefix
    ? `${last ? stroke.corner : stroke.branch}${stroke.horizontal} `
    : ''
  const suffix =
    node.display === 'redact'
      ? ' REDACTED'
      : node.display === 'seal'
        ? ' SEALED'
        : ''
  const size = Number.isFinite(node.size) ? ` (${node.size})` : ''
  const lines = [`${prefix}${connector}${node.path}${size}${suffix}`]
  const childPrefix = `${prefix}${last ? '    ' : `${stroke.vertical}   `}`

  node.children?.forEach((child, index) => {
    lines.push(
      renderNode(
        child,
        childPrefix,
        index === node.children.length - 1,
        stroke,
      ),
    )
  })
  return lines.join('\n')
}

export function renderDirectoryTree(tree, { strokeThickness = 1 } = {}) {
  const stroke = strokes[strokeThickness]
  if (!stroke) throw new RangeError('strokeThickness must be 1, 2, or 3')
  return renderNode(tree, '', true, stroke)
}

export default async function dirdraw(target = '.', options = {}) {
  return renderDirectoryTree(
    await createDirectoryTreeData(target, options),
    options,
  )
}
