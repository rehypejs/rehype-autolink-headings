# rehype-autolink-headings

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[**rehype**][rehype] plugin to automatically add links to headings (h1-h6) that
already have an ID.

## Install

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c):
Node 12+ is needed to use it and it must be `import`ed instead of `require`d.

[npm][]:

```sh
npm install rehype-autolink-headings
```

## Use

Say we have the following file, `fragment.html`:

```html
<h1>Lorem ipsum 😪</h1>
<h2>dolor—sit—amet</h2>
<h3>consectetur &amp; adipisicing</h3>
<h4>elit</h4>
<h5>elit</h5>
```

And our script, `example.js`, looks as follows:

```js
import fs from 'node:fs'
import rehype from 'rehype'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'

const buf = fs.readFileSync('fragment.html')

rehype()
  .data('settings', {fragment: true})
  .use(rehypeSlug)
  .use(rehypeAutolinkHeadings)
  .process(buf)
  .then((file) => {
    console.log(String(file))
  })
```

Now, running `node example` yields:

```html
<h1 id="lorem-ipsum-"><a aria-hidden="true" href="#lorem-ipsum-"><span class="icon icon-link"></span></a>Lorem ipsum 😪</h1>
<h2 id="dolorsitamet"><a aria-hidden="true" href="#dolorsitamet"><span class="icon icon-link"></span></a>dolor—sit—amet</h2>
<h3 id="consectetur--adipisicing"><a aria-hidden="true" href="#consectetur--adipisicing"><span class="icon icon-link"></span></a>consectetur &#x26; adipisicing</h3>
<h4 id="elit"><a aria-hidden="true" href="#elit"><span class="icon icon-link"></span></a>elit</h4>
<h5 id="elit-1"><a aria-hidden="true" href="#elit-1"><span class="icon icon-link"></span></a>elit</h5>
```

## API

This package exports no identifiers.
The default export is `rehypeAutolinkHeadings`.

### `unified().use(rehypeAutolinkHeadings[, options])`

Add links to headings (h1-h6) with an `id`.

**Note**: this plugin expects `id`s to already exist on headings.
One way to add those automatically is [`rehype-slug`][slug] (see example).

##### `options`

###### `options.behavior`

How to create links (`string`, default: `'prepend'`).

*   `'prepend'` — inject link before the heading text
*   `'append'` — inject link after the heading text
*   `'wrap'` — wrap the whole heading text with the link
*   `'before'` — insert link before the heading
*   `'after'` — insert link after the heading

Supplying `wrap` will ignore any value defined by the `content` option.
Supplying `prepend`, `append`, or `wrap` will ignore the `group` option.

###### `options.properties`

Extra properties to set on the link (`Object?`).
Defaults to `{ariaHidden: true, tabIndex: -1}` when in `'prepend'` or
`'append'` mode.

###### `options.content`

[**hast**][hast] nodes to insert in the link (`Function|Node|Children`).
By default, the following is used:

```js
{
  type: 'element',
  tagName: 'span',
  properties: {className: ['icon', 'icon-link']},
  children: []
}
```

If `behavior` is `wrap`, then `content` is ignored.

If `content` is a function, it’s called with the current heading (`Element`) and
should return one or more nodes:

```js
import {toString} from 'hast-util-to-string'
import {h} from 'hastscript'

// …

function content(node) {
  return [
    h('span.visually-hidden', 'Read the “', toString(node), '” section'),
    h('span.icon.icon-link', {ariaHidden: true})
  ]
}
```

###### `options.group`

[**hast**][hast] node to wrap the heading and link with (`Function|Node`), if
`behavior` is `before` or `after`.
There is no default.

If `behavior` is `prepend`, `append`, or `wrap`, then `group` is ignored.

If `group` is a function, it’s called with the current heading (`Element`) and
should return a hast node.

```js
import {h} from 'hastscript'

// …

function group(node) {
  return h('.heading-' + node.charAt(1) + '-group')
}
```

###### `options.test`

Test to define which heading elements are linked.
Any test that can be given to [`hast-util-is-element`][is] is supported.
The default (no test) is to link all headings.

Can be used to link only `<h1>` through `<h3>` (with `['h1', 'h2', 'h3']`), or
for example all except `<h1>` (with `['h2', 'h3', 'h4', 'h5', 'h6']`).

Functions can also be given to do more complex things!

## Security

Use of `rehype-autolink-headings` can open you up to a
[cross-site scripting (XSS)][xss] attack if you pass user provided content in
`properties` or `content`.

Always be wary of user input and use [`rehype-sanitize`][sanitize].

## Related

*   [`rehype-slug`][slug]
    — Add `id`s to headings
*   [`rehype-highlight`](https://github.com/rehypejs/rehype-highlight)
    — Syntax highlight code blocks
*   [`rehype-toc`](https://github.com/JS-DevTools/rehype-toc)
    — Add a table of contents (TOC)

## Contribute

See [`contributing.md`][contributing] in [`rehypejs/.github`][health] for ways
to get started.
See [`support.md`][support] for ways to get help.

This project has a [code of conduct][coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://github.com/rehypejs/rehype-autolink-headings/workflows/main/badge.svg

[build]: https://github.com/rehypejs/rehype-autolink-headings/actions

[coverage-badge]: https://img.shields.io/codecov/c/github/rehypejs/rehype-autolink-headings.svg

[coverage]: https://codecov.io/github/rehypejs/rehype-autolink-headings

[downloads-badge]: https://img.shields.io/npm/dm/rehype-autolink-headings.svg

[downloads]: https://www.npmjs.com/package/rehype-autolink-headings

[size-badge]: https://img.shields.io/bundlephobia/minzip/rehype-autolink-headings.svg

[size]: https://bundlephobia.com/result?p=rehype-autolink-headings

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/rehypejs/rehype/discussions

[npm]: https://docs.npmjs.com/cli/install

[health]: https://github.com/rehypejs/.github

[contributing]: https://github.com/rehypejs/.github/blob/HEAD/contributing.md

[support]: https://github.com/rehypejs/.github/blob/HEAD/support.md

[coc]: https://github.com/rehypejs/.github/blob/HEAD/code-of-conduct.md

[license]: license

[author]: https://wooorm.com

[hast]: https://github.com/syntax-tree/hast

[rehype]: https://github.com/rehypejs/rehype

[xss]: https://en.wikipedia.org/wiki/Cross-site_scripting

[sanitize]: https://github.com/rehypejs/rehype-sanitize

[slug]: https://github.com/rehypejs/rehype-slug

[is]: https://github.com/syntax-tree/hast-util-is-element
