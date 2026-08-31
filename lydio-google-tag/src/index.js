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

import lydio from '@alexstevovich/lydio'

export class GoogleTag extends lydio.Fragment {
  constructor(googleAnalyticsTagId) {
    super()

    // External loader
    const gtagManager = this.add(new lydio.Tag('script'))
    gtagManager.setAttribute('async')
    gtagManager.setAttribute(
      'src',
      `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsTagId}`,
    )

    // Inline script
    const gtagInline = this.add(new lydio.Tag('script'))
    gtagInline.add(
      `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${googleAnalyticsTagId}');`.trim(),
    )

    this._manager = gtagManager
    this._inline = gtagInline
  }

  set nonce(value) {
    this._manager.setAttribute('nonce', value)
    this._inline.setAttribute('nonce', value)
  }
}

export default GoogleTag
