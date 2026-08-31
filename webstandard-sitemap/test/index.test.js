import assert from 'node:assert/strict'
import test from 'node:test'

import {
  SitemapXml,
  SitemapXmlIndex,
  SitemapXmlIndexItem,
  SitemapXmlUrl,
} from '../src/index.js'

test('generates XML-safe sitemap entries', () => {
  const sitemap = new SitemapXml()
  sitemap.addUrl(
    new SitemapXmlUrl('/search?q=one&kind=<all>', {
      changefreq: 'weekly',
      priority: 0.8,
    }),
  )
  assert.match(
    sitemap.output({ domain: 'https://example.com' }),
    /one&amp;kind=&lt;all&gt;/,
  )
})

test('generates sitemap indexes and supports JSON round trips', () => {
  const index = new SitemapXmlIndex()
  index.addItem(
    new SitemapXmlIndexItem('/sitemap.xml', {
      lastmod: new Date('2024-02-20T00:00:00.000Z'),
    }),
  )
  const rebuilt = SitemapXmlIndex.fromJSON(index.toJSON())
  assert.deepEqual(rebuilt.toJSON(), index.toJSON())
  assert.match(rebuilt.output(), /<sitemapindex/)
})
