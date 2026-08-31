/*
 * @webstandard/sitemap
 *
 * ~ Silent, precise, effective.
 *         No ghost routes. No false intel.
 *               Every URL accounted for.
 *
 * Copyright 2015 Alex Stevovich
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export class SitemapXml {
  constructor() {
    /** @type {SitemapXmlUrl[]} */
    this.urls = []
  }

  /**
   * Add an existing SitemapXmlUrl instance to this sitemap.
   * @param {SitemapXmlUrl} urlEntry
   */
  addUrl(urlEntry) {
    if (!(urlEntry instanceof SitemapXmlUrl)) {
      throw new Error('addUrl() expects a SitemapXmlUrl instance.')
    }
    this.urls.push(urlEntry)
  }

  /**
   * Merge another sitemap into this one.
   * @param {SitemapXml} other
   */
  addSitemap(other) {
    if (!(other instanceof SitemapXml)) {
      throw new Error('addSitemap() expects a SitemapXml instance.')
    }
    this.urls.push(...other.urls)
  }

  /**
   * Return a JSON representation of all entries.
   * @returns {object[]}
   */
  toJSON() {
    return this.urls.map((url) => url.toJSON())
  }

  /**
   * Create a SitemapXml from JSON data.
   * @param {object[]|string} json
   * @returns {SitemapXml}
   */
  static fromJSON(json) {
    const data = typeof json === 'string' ? JSON.parse(json) : json
    const sitemap = new SitemapXml()
    for (const item of data) {
      sitemap.addUrl(SitemapXmlUrl.fromJSON(item))
    }
    return sitemap
  }

  /**
   * Generate sitemap.xml output.
   * @param {object} [options]
   * @param {string} [options.dateFormat='full']
   * @param {string} [options.domain='']
   * @param {boolean} [options.force=false]
   * @returns {string}
   */
  output({ dateFormat = 'full', domain = '', force = false } = {}) {
    if (!force && this.urls.length === 0) {
      throw new Error(
        'Sitemap must have at least one URL. Use { force: true } to override.',
      )
    }

    // Basic validation before output
    for (const url of this.urls) {
      if (!(url instanceof SitemapXmlUrl)) {
        throw new Error(
          'Sitemap contains invalid entries — all must be SitemapXmlUrl.',
        )
      }
    }

    const xmlUrls = this.urls
      .map((url) => url.output({ dateFormat, domain }))
      .join('')

    return (
      `<?xml version="1.0" encoding="UTF-8"?>` +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
      xmlUrls +
      `</urlset>`
    )
  }
}

function escapeXml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

export class SitemapXmlUrl {
  constructor(loc, options = {}) {
    if (typeof loc !== 'string') {
      throw new Error('loc must be a string.')
    }

    this._loc = loc
    this._lastmod = null
    this._changefreq = null
    this._priority = null

    // Apply validated options via setters
    if (options.priority !== undefined) this.priority = options.priority
    if (options.changefreq !== undefined) this.changefreq = options.changefreq
    if (options.lastmod !== undefined) this.lastmod = options.lastmod
  }

  // ───────────────────────────────
  //  ACCESSORS
  // ───────────────────────────────

  get loc() {
    return this._loc
  }

  get lastmod() {
    return this._lastmod
  }

  set lastmod(date) {
    if (!(date instanceof Date)) {
      throw new Error('lastmod must be a Date object.')
    }
    this._lastmod = date
  }

  get changefreq() {
    return this._changefreq
  }

  set changefreq(freq) {
    const validFreqs = [
      'always',
      'hourly',
      'daily',
      'weekly',
      'monthly',
      'yearly',
      'never',
    ]
    if (!validFreqs.includes(freq)) {
      throw new Error(`Invalid changefreq value: ${freq}`)
    }
    this._changefreq = freq
  }

  get priority() {
    return this._priority
  }

  set priority(value) {
    if (typeof value !== 'number' || value < 0.0 || value > 1.0) {
      throw new Error('priority must be a number between 0.0 and 1.0.')
    }
    this._priority = value
  }

  // ───────────────────────────────
  //  SERIALIZATION
  // ───────────────────────────────

  toJSON() {
    const json = { loc: this._loc }

    if (this._lastmod) json.lastmod = this._lastmod.toISOString()

    if (this._changefreq) json.changefreq = this._changefreq

    if (this._priority !== null) json.priority = this._priority

    return json
  }

  output({ dateFormat = 'full', domain = '' } = {}) {
    const fullLoc = domain ? domain + this._loc : this._loc
    let xml = `<url><loc>${escapeXml(fullLoc)}</loc>`

    if (this._lastmod) {
      const formattedDate =
        dateFormat === 'date-only'
          ? this._lastmod.toISOString().split('T')[0]
          : this._lastmod.toISOString()
      xml += `<lastmod>${formattedDate}</lastmod>`
    }

    if (this._changefreq) xml += `<changefreq>${this._changefreq}</changefreq>`
    if (this._priority !== null)
      xml += `<priority>${this._priority.toFixed(1)}</priority>`

    xml += `</url>`
    return xml
  }

  // ───────────────────────────────
  //  STATIC HELPERS
  // ───────────────────────────────

  static fromJSON(json) {
    const data = typeof json === 'string' ? JSON.parse(json) : json

    const opts = {}
    if (data.lastmod) opts.lastmod = new Date(data.lastmod)
    if (data.changefreq) opts.changefreq = data.changefreq
    if (data.priority !== undefined) opts.priority = data.priority

    return new SitemapXmlUrl(data.loc, opts)
  }
}

export class SitemapXmlIndex {
  constructor() {
    /** @type {SitemapXmlIndexItem[]} */
    this.items = []
  }

  /**
   * Add an existing SitemapXmlIndexItem instance.
   * @param {SitemapXmlIndexItem} item
   */
  addItem(item) {
    if (!(item instanceof SitemapXmlIndexItem)) {
      throw new Error('addItem() expects a SitemapXmlIndexItem instance.')
    }
    this.items.push(item)
  }

  /**
   * Merge another index into this one.
   * @param {SitemapXmlIndex} other
   */
  addIndex(other) {
    if (!(other instanceof SitemapXmlIndex)) {
      throw new Error('addIndex() expects a SitemapXmlIndex instance.')
    }
    this.items.push(...other.items)
  }

  /**
   * Return a JSON representation of all index items.
   * @returns {object[]}
   */
  toJSON() {
    return this.items.map((item) => item.toJSON())
  }

  /**
   * Create a SitemapXmlIndex from JSON data.
   * @param {object[]|string} json
   * @returns {SitemapXmlIndex}
   */
  static fromJSON(json) {
    const data = typeof json === 'string' ? JSON.parse(json) : json
    const index = new SitemapXmlIndex()
    for (const entry of data) {
      index.addItem(SitemapXmlIndexItem.fromJSON(entry))
    }
    return index
  }

  /**
   * Generate sitemapindex.xml output.
   * @param {object} [options]
   * @param {string} [options.dateFormat='full']
   * @param {string} [options.domain='']
   * @param {boolean} [options.force=false]
   * @returns {string}
   */
  output({ dateFormat = 'full', domain = '', force = false } = {}) {
    if (!force && this.items.length === 0) {
      throw new Error(
        'Sitemap index must have at least one sitemap. Use { force: true } to override.',
      )
    }

    // Validate before writing
    for (const item of this.items) {
      if (!(item instanceof SitemapXmlIndexItem)) {
        throw new Error('Sitemap index contains invalid items.')
      }
    }

    const xmlItems = this.items
      .map((item) => item.output({ dateFormat, domain }))
      .join('')

    return (
      `<?xml version="1.0" encoding="UTF-8"?>` +
      `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
      xmlItems +
      `</sitemapindex>`
    )
  }
}

/**
 * Represents a single sitemap reference in an index.
 */
export class SitemapXmlIndexItem {
  /**
   * @param {string} loc - The full or relative location of the sitemap file.
   * @param {object} [options]
   * @param {Date|null} [options.lastmod=null]
   */
  constructor(loc, { lastmod = null } = {}) {
    if (typeof loc !== 'string') {
      throw new Error('loc must be a string.')
    }

    this._loc = loc
    this._lastmod = null

    if (lastmod !== null) this.lastmod = lastmod
  }

  get loc() {
    return this._loc
  }

  get lastmod() {
    return this._lastmod
  }

  set lastmod(date) {
    if (!(date instanceof Date)) {
      throw new Error('lastmod must be a Date object.')
    }
    this._lastmod = date
  }

  /**
   * Convert to JSON-safe representation.
   * @returns {object}
   */
  toJSON() {
    return {
      loc: this._loc,
      lastmod: this._lastmod ? this._lastmod.toISOString() : null,
    }
  }

  /**
   * Rebuild an item from JSON data.
   * @param {object|string} json
   * @returns {SitemapXmlIndexItem}
   */
  static fromJSON(json) {
    const data = typeof json === 'string' ? JSON.parse(json) : json
    const opts = {}
    if (data.lastmod) opts.lastmod = new Date(data.lastmod)
    return new SitemapXmlIndexItem(data.loc, opts)
  }

  /**
   * Output XML for this index item.
   * @param {object} [options]
   * @param {string} [options.dateFormat='full']
   * @param {string} [options.domain='']
   * @returns {string}
   */
  output({ dateFormat = 'full', domain = '' } = {}) {
    const fullLoc = domain ? domain + this._loc : this._loc
    let xml = `<sitemap><loc>${escapeXml(fullLoc)}</loc>`

    if (this._lastmod) {
      const formattedDate =
        dateFormat === 'date-only'
          ? this._lastmod.toISOString().split('T')[0]
          : this._lastmod.toISOString()
      xml += `<lastmod>${formattedDate}</lastmod>`
    }

    xml += `</sitemap>`
    return xml
  }
}
