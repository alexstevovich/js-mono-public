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

import * as lydio from '@alexstevovich/lydio'

class Schema extends lydio.Tag {
  constructor() {
    super('script')

    this.setAttribute('type', 'application/ld+json')

    this.schema = {
      '@context': 'https://schema.org',
      '@graph': [],
    }
  }

  addSchema(data) {
    this.schema['@graph'].push(data)
  }

  toHtml() {
    if (this.schema['@graph'].length === 0) {
      return ''
    }

    this.clear()
    this.add(JSON.stringify(this.schema))

    return super.toHtml()
  }
}

export { Schema }

export default Schema
