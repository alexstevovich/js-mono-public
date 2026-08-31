# @webstandard/sitemap

Generate sitemap and sitemap-index XML documents.

```js
import { SitemapXml, SitemapXmlUrl } from '@webstandard/sitemap'

const sitemap = new SitemapXml()
sitemap.addUrl(new SitemapXmlUrl('/about', { changefreq: 'weekly' }))
console.log(sitemap.output({ domain: 'https://example.com' }))
```

URL entries support last-modified dates, change frequency, priority, JSON round
trips, and XML-safe output.

This package uses ECMAScript modules and is private until explicitly reviewed
for publication.

## License

Apache-2.0. Copyright 2015 Alex Stevovich.
