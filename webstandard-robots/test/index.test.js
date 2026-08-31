import assert from 'node:assert/strict'
import test from 'node:test'

import Robots from '../src/index.js'

test('generates groups, host, and sitemap directives', () => {
  const robots = new Robots.RobotsTxt()
  robots.addGroup(new Robots.Group('*').addAllow('/').addDisallow('/private'))
  robots.setHost('example.com')
  robots.addSitemap('https://example.com/sitemap.xml')

  assert.equal(
    robots.output(),
    'User-agent: *\nAllow: /\nDisallow: /private\n\n' +
      'Host: example.com\nSitemap: https://example.com/sitemap.xml',
  )
})

test('supports JSON round trips', () => {
  const robots = new Robots.RobotsTxt()
  robots.addGroup(new Robots.Group('ExampleBot').addCrawlDelay(5))
  assert.deepEqual(
    Robots.RobotsTxt.fromJSON(robots.toJSON()).toJSON(),
    robots.toJSON(),
  )
})
