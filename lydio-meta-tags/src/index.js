/*
 * Copyright 2015 Alex Stevovich (https://alexstevovich.com)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Fragment, Tag } from '@alexstevovich/lydio'
import { Link, Meta, MetaName, MetaProperty } from '@alexstevovich/lydio-html'

class MetaTags extends Fragment {
  constructor() {
    super()

    // Standard meta
    this.title = this.add(new Tag('title'))

    this.canonical = this.add(new Link())
    this.canonical.rel = 'canonical'

    this.charset = this.add(new Meta())
    this.charset.setAttribute('charset', 'utf-8')

    this.viewport = this.add(new MetaName('viewport'))
    this.viewport.value = 'width=device-width, initial-scale=1.0'

    this.robots = this.add(new MetaName('robots'))
    this.robots.value = 'index, follow'

    this.description = this.add(new MetaName('description'))
    this.themeColor = this.add(new MetaName('theme-color'))

    // Open Graph tags
    this.ogType = this.add(new MetaProperty('og:type'))
    this.ogUrl = this.add(new MetaProperty('og:url'))
    this.ogLocale = this.add(new MetaProperty('og:locale'))
    this.ogSiteName = this.add(new MetaProperty('og:site_name'))
    this.ogTitle = this.add(new MetaProperty('og:title'))
    this.ogDescription = this.add(new MetaProperty('og:description'))
    this.ogImage = this.add(new MetaProperty('og:image'))
    this.ogImageWidth = this.add(new MetaProperty('og:image:width'))
    this.ogImageHeight = this.add(new MetaProperty('og:image:height'))

    // Twitter tags
    this.twitterCard = this.add(new MetaName('twitter:card'))
    this.twitterTitle = this.add(new MetaName('twitter:title'))
    this.twitterDescription = this.add(new MetaName('twitter:description'))
    this.twitterImage = this.add(new MetaName('twitter:image'))
  }

  set allTitle(value) {
    this.title.clear()
    this.title.add(value)
    this.ogTitle.value = value
    this.twitterTitle.value = value
  }

  set allDescription(value) {
    this.description.value = value
    this.ogDescription.value = value
    this.twitterDescription.value = value
  }

  set allCanonical(value) {
    this.canonical.href = value
    this.ogUrl.value = value
  }

  set allImage(value) {
    this.ogImage.value = value
    this.twitterImage.value = value
  }
}

export { MetaTags }

export default MetaTags
