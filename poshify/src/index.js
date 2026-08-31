/*
 * Copyright 2018-2025 Alex Stevovich
 * Licensed under the Apache License, Version 2.0.
 */

import fs from 'node:fs/promises'
import path from 'node:path'

export const DEFAULT_ORDER = Object.freeze([
  'name',
  'version',
  'description',
  'keywords',
  'homepage',
  'bugs',
  'repository',
  'funding',
  'license',
  'author',
  'contributors',
  'private',
  'type',
  'main',
  'module',
  'types',
  'exports',
  'imports',
  'bin',
  'files',
  'workspaces',
  'scripts',
  'engines',
  'os',
  'cpu',
  'packageManager',
  'publishConfig',
  '+',
  'peerDependencies',
  'peerDependenciesMeta',
  'dependencies',
  'optionalDependencies',
  'devDependencies',
])

function assertPackageObject(value) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new TypeError('package data must be a non-null object')
  }
}

export function sortPackageJsonKeys(packageData, order = DEFAULT_ORDER) {
  assertPackageObject(packageData)
  if (!Array.isArray(order)) throw new TypeError('order must be an array')

  const markerIndex = order.indexOf('+')
  const knownKeys = new Set(order.filter((key) => key !== '+'))
  const remainingKeys = Object.keys(packageData)
    .filter((key) => !knownKeys.has(key))
    .sort()
  const finalOrder =
    markerIndex === -1
      ? [...order, ...remainingKeys]
      : [
          ...order.slice(0, markerIndex),
          ...remainingKeys,
          ...order.slice(markerIndex + 1),
        ]

  const sorted = {}
  for (const key of finalOrder) {
    if (Object.hasOwn(packageData, key)) sorted[key] = packageData[key]
  }

  for (const key of Object.keys(packageData)) delete packageData[key]
  return Object.assign(packageData, sorted)
}

export function sort(packageData, order = DEFAULT_ORDER) {
  return sortPackageJsonKeys(packageData, order)
}

export async function sortAndSavePackageJson(
  directory = process.cwd(),
  order = DEFAULT_ORDER,
) {
  const packagePath = path.join(directory, 'package.json')
  const source = await fs.readFile(packagePath, 'utf8')
  const packageData = sortPackageJsonKeys(JSON.parse(source), order)
  await fs.writeFile(packagePath, `${JSON.stringify(packageData, null, 2)}\n`)
  return packageData
}

export default sort
