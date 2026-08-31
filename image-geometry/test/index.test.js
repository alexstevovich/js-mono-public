import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'

import scanImageGeometry, {
  readImageGeometry,
  readRasterGeometry,
  readSvgGeometry,
  scanRasterGeometry,
  scanSvgGeometry,
} from '../src/index.js'

const ONE_PIXEL_PNG =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wIAAgMBAf8LZnsAAAAASUVORK5CYII='

async function fixture(context) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'image-geometry-'))
  context.after(() => fs.rm(root, { recursive: true, force: true }))
  await fs.mkdir(path.join(root, 'nested'))
  await fs.writeFile(
    path.join(root, 'pixel.png'),
    Buffer.from(ONE_PIXEL_PNG, 'base64'),
  )
  await fs.writeFile(
    path.join(root, 'wide.svg'),
    '<svg width="20" height="10" xmlns="http://www.w3.org/2000/svg"/>',
  )
  await fs.writeFile(
    path.join(root, 'nested', 'tall.svg'),
    '<svg viewBox="0 0 10 30" xmlns="http://www.w3.org/2000/svg"/>',
  )
  await fs.writeFile(path.join(root, 'broken.svg'), '<svg/>')
  await fs.writeFile(path.join(root, 'ignored.txt'), 'text')
  return root
}

test('reads raster, SVG, and unified single-file geometry', async (context) => {
  const root = await fixture(context)
  const raster = await readRasterGeometry(path.join(root, 'pixel.png'))
  const svg = await readSvgGeometry(path.join(root, 'wide.svg'))
  const unified = await readImageGeometry(path.join(root, 'wide.svg'))

  assert.equal(raster.width, 1)
  assert.equal(raster.height, 1)
  assert.equal(raster.format, 'png')
  assert.equal(svg.aspectRatio, '20/10')
  assert.equal(svg.orientation, 'landscape')
  assert.deepEqual(unified, svg)
})

test('scans raster and SVG directories independently', async (context) => {
  const root = await fixture(context)
  const raster = await scanRasterGeometry(root)
  const svg = await scanSvgGeometry(root)

  assert.deepEqual(
    raster.map(({ path: pathname }) => pathname),
    ['pixel.png'],
  )
  assert.deepEqual(
    svg.map(({ path: pathname }) => pathname),
    ['wide.svg'],
  )
})

test('unifies recursive scans in deterministic path order', async (context) => {
  const root = await fixture(context)
  const result = await scanImageGeometry(root, { recursive: true })

  assert.deepEqual(
    result.map(({ path: pathname }) => pathname),
    ['nested/tall.svg', 'pixel.png', 'wide.svg'],
  )
  assert.equal(result[0].orientation, 'portrait')
})

test('supports format selection and explicit scan error policy', async (context) => {
  const root = await fixture(context)
  const svgOnly = await scanImageGeometry(root, { includeRaster: false })

  assert.ok(svgOnly.every(({ format }) => format === 'svg'))
  await assert.rejects(() => scanSvgGeometry(root, { onError: 'throw' }))
})
