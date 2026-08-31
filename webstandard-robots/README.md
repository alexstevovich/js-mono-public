# @webstandard/robots

Generate structured `robots.txt` documents.

```js
import Robots from '@webstandard/robots'

const robots = new Robots.RobotsTxt()
robots.addGroup(new Robots.Group('*').addAllow('/').addDisallow('/private'))
robots.addSitemap('https://example.com/sitemap.xml')
console.log(robots.output())
```

Groups with the same user agent are merged, duplicate rules and sitemaps are
removed, and instances support JSON round trips.

This package uses ECMAScript modules and is private until explicitly reviewed
for publication.

## License

Apache-2.0. Copyright 2015 Alex Stevovich.
