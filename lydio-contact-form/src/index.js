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

export default class ContactForm extends lydio.Tag {
  constructor() {
    super('form').setAttribute('autocomplete', 'on')

    // Name
    const nameLabel = this.add(new lydio.Tag('label'))
    nameLabel.add('Name')
    const nameInput = nameLabel.add(new lydio.Leaf('input'))
    nameInput.setAttribute('type', 'text')
    nameInput.setAttribute('name', 'name')
    nameInput.setAttribute('placeholder', 'Your Name')
    nameInput.setAttribute('required')

    // Email
    const emailLabel = this.add(new lydio.Tag('label'))
    emailLabel.add('Email')
    const emailInput = emailLabel.add(new lydio.Leaf('input'))
    emailInput.setAttribute('type', 'email')
    emailInput.setAttribute('name', 'email')
    emailInput.setAttribute('placeholder', 'Your Email')
    emailInput.setAttribute('required')

    // Message
    const messageLabel = this.add(new lydio.Tag('label'))
    messageLabel.add('Message')
    const messageTextArea = messageLabel.add(new lydio.Tag('textarea'))
    messageTextArea.setAttribute('name', 'message')
    messageTextArea.setAttribute('placeholder', 'Your Message')
    messageTextArea.setAttribute('required')

    // Submit button
    const submitButton = this.add(new lydio.Tag('button'))
    submitButton.setAttribute('type', 'submit')
    submitButton.add('Send')
  }

  set setPost(route) {
    this.setAttribute('action', route)
    this.setAttribute('method', 'POST')
  }
}
