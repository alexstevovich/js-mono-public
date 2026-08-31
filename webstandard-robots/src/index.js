/*
 * @webstandard/robots
 *
 * ~ Define the crawl zones. Control the AO.
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

export class RobotsTxt {
  constructor() {
    /** @type {RobotsTxtGroup[]} */
    this.groups = []
    /** @type {Set<string>} */
    this.sitemaps = new Set()
    /** @type {string|null} */
    this.host = null
  }

  /**
   * Add a RobotsTxtGroup instance.
   * If another group with the same agent exists, merge their rules.
   * @param {RobotsTxtGroup} group
   */
  addGroup(group) {
    if (!(group instanceof RobotsTxtGroup)) {
      throw new Error('addGroup() expects a RobotsTxtGroup instance.')
    }
    const existing = this.groups.find((g) => g.agent === group.agent)
    if (existing) existing.merge(group)
    else this.groups.push(group)
  }

  /**
   * Add a group from JSON.
   * @param {object|string} json
   */
  addGroupFromJSON(json) {
    const group = RobotsTxtGroup.fromJSON(json)
    this.addGroup(group)
  }

  /**
   * Merge another RobotsTxt into this one.
   * @param {RobotsTxt} other
   */
  merge(other) {
    if (!(other instanceof RobotsTxt)) {
      throw new Error('merge() expects a RobotsTxt instance.')
    }
    for (const g of other.groups) this.addGroup(g)
    for (const s of other.sitemaps) this.sitemaps.add(s)
    if (other.host) this.host = other.host
  }

  /**
   * Add a full fragment of groups/sitemaps from a JSON object.
   * @param {object|string} fragment
   */
  addFragment(fragment) {
    const data = typeof fragment === 'string' ? JSON.parse(fragment) : fragment
    if (Array.isArray(data.groups)) {
      for (const g of data.groups) this.addGroupFromJSON(g)
    }
    if (Array.isArray(data.sitemaps)) {
      for (const s of data.sitemaps) this.sitemaps.add(s)
    }
    if (data.host) this.host = data.host
  }

  /**
   * Add a sitemap entry.
   * @param {string} url
   */
  addSitemap(url) {
    if (typeof url !== 'string')
      throw new Error('Sitemap URL must be a string.')
    this.sitemaps.add(url)
  }

  /**
   * Set the Host directive.
   * @param {string} host
   */
  setHost(host) {
    if (typeof host !== 'string') throw new Error('Host must be a string.')
    this.host = host
  }

  /**
   * Convert to JSON-safe representation.
   * @returns {object}
   */
  toJSON() {
    return {
      groups: this.groups.map((g) => g.toJSON()),
      sitemaps: [...this.sitemaps],
      host: this.host,
    }
  }

  /**
   * Create a RobotsTxt from JSON.
   * @param {object|string} json
   * @returns {RobotsTxt}
   */
  static fromJSON(json) {
    const data = typeof json === 'string' ? JSON.parse(json) : json
    const robots = new RobotsTxt()
    if (data.groups) {
      for (const g of data.groups) robots.addGroupFromJSON(g)
    }
    if (data.sitemaps) {
      for (const s of data.sitemaps) robots.addSitemap(s)
    }
    if (data.host) robots.setHost(data.host)
    return robots
  }

  /**
   * Output text form of robots.txt.
   * @param {{force?: boolean}} [options]
   * @returns {string}
   */
  output() {
    const lines = []

    // Iterate over each group and push its output
    for (let i = 0; i < this.groups.length; i++) {
      lines.push(this.groups[i].output())
      // Add a blank line after each group except the last one
      if (i < this.groups.length - 1) {
        lines.push('')
      }
    }

    // Add a blank line before the host and sitemap sections (if they exist)
    if (this.host || this.sitemaps.size > 0) {
      lines.push('')
    }

    // Add the host if it exists
    if (this.host) lines.push(`Host: ${this.host}`)

    // Add sitemaps if they exist
    if (this.sitemaps.size > 0) {
      for (const s of this.sitemaps) {
        lines.push(`Sitemap: ${s}`)
      }
    }

    return lines.join('\n').trim() // Ensure no trailing newline
  }
}

/**
 * Represents one User-agent group block.
 */
export class RobotsTxtGroup {
  /**
   * @param {string} agent
   * @param {RobotsTxtRule[]} [rules=[]]
   */
  constructor(agent, rules = []) {
    if (typeof agent !== 'string') {
      throw new Error('agent must be a string.')
    }
    /** @type {string} */
    this.agent = agent
    /** @type {RobotsTxtRule[]} */
    this.rules = []
    for (const rule of rules) this.addRule(rule)
  }

  /**
   * Add a RobotsTxtRule instance.
   * @param {RobotsTxtRule} rule
   */
  addRule(rule) {
    if (!(rule instanceof RobotsTxtRule)) {
      throw new Error('addRule() expects a RobotsTxtRule instance.')
    }
    const exists = this.rules.some(
      (r) => r.directive === rule.directive && r.value === rule.value,
    )
    if (!exists) this.rules.push(rule)
  }

  /**
   * Merge another group (same agent).
   * @param {RobotsTxtGroup} other
   */
  merge(other) {
    if (!(other instanceof RobotsTxtGroup)) {
      throw new Error('merge() expects a RobotsTxtGroup instance.')
    }
    if (this.agent !== other.agent) return
    for (const rule of other.rules) this.addRule(rule)
  }

  /**
   * Add an Allow directive helper.
   * @param {string} path
   */
  addAllow(path) {
    this.addRule(RobotsTxtRule.allow(path))
    return this
  }

  /**
   * Add a Disallow directive helper.
   * @param {string} path
   */
  addDisallow(path) {
    this.addRule(RobotsTxtRule.disallow(path))
    return this
  }

  /**
   * Add a Crawl-delay directive helper.
   * @param {number} seconds
   */
  addCrawlDelay(seconds) {
    this.addRule(RobotsTxtRule.crawlDelay(seconds))
    return this
  }

  /**
   * Serialize to JSON.
   * @returns {object}
   */
  toJSON() {
    return {
      agent: this.agent,
      rules: this.rules.map((r) => r.toJSON()),
    }
  }

  /**
   * Recreate from JSON.
   * @param {object|string} json
   * @returns {RobotsTxtGroup}
   */
  static fromJSON(json) {
    const data = typeof json === 'string' ? JSON.parse(json) : json
    const rules = (data.rules || []).map((r) => RobotsTxtRule.fromJSON(r))
    return new RobotsTxtGroup(data.agent, rules)
  }

  /**
   * Output as text.
   * @returns {string}
   */
  output() {
    const lines = [`User-agent: ${this.agent}`]
    for (const rule of this.rules) lines.push(rule.output())
    return lines.join('\n')
  }
}

/**
 * Represents a single rule like "Disallow: /admin".
 */
export class RobotsTxtRule {
  /**
   * @param {"Allow"|"Disallow"|"Crawl-delay"} directive
   * @param {string|number} value
   */
  constructor(directive, value) {
    const valid = ['Allow', 'Disallow', 'Crawl-delay']
    if (!valid.includes(directive)) {
      throw new Error(`Invalid directive: ${directive}`)
    }
    if (typeof value !== 'string' && typeof value !== 'number') {
      throw new Error('value must be a string or number.')
    }
    this.directive = directive
    this.value = value
  }

  /**
   * Static helper to create an Allow rule.
   * @param {string} path
   */
  static allow(path) {
    return new RobotsTxtRule('Allow', path)
  }

  /**
   * Static helper to create a Disallow rule.
   * @param {string} path
   */
  static disallow(path) {
    return new RobotsTxtRule('Disallow', path)
  }

  /**
   * Static helper to create a Crawl-delay rule.
   * @param {number} seconds
   */
  static crawlDelay(seconds) {
    return new RobotsTxtRule('Crawl-delay', seconds)
  }

  toJSON() {
    return { directive: this.directive, value: this.value }
  }

  static fromJSON(json) {
    const data = typeof json === 'string' ? JSON.parse(json) : json
    return new RobotsTxtRule(data.directive, data.value)
  }

  output() {
    return `${this.directive}: ${this.value}`
  }
}

const WebStandardRobots = {
  RobotsTxt: RobotsTxt,
  Group: RobotsTxtGroup,
  Rule: RobotsTxtRule,
}

export default WebStandardRobots
