# rehype-autolink-headings [![Build Status][travis-badge]][travis] [![Coverage Status][codecov-badge]][codecov]

Automatically add links to headings (h1-h6) with [**rehype**][rehype].

## Installation

[npm][]:

```bash
npm install rehype-autolink-headings
```

## Usage

Say we have the following file, `fragment.html`:

```html
<h1>Lorem ipsum 😪</h1>
<h2>dolor—sit—amet</h2>
<h3>consectetur &amp; adipisicing</h3>
<h4>elit</h4>
<h5>elit</h5>
```

And our script, `example.js`, looks as follows:

```javascript
var fs = require('fs')
var rehype = require('rehype')
var slug = require('rehype-slug')
var link = require('rehype-autolink-headings')

var doc = fs.readFileSync('fragment.html')

rehype()
  .data('settings', {fragment: true})
  .use(slug)
  .use(link)
  .process(doc, function(err, file) {
    if (err) throw err
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

### `rehype().use(link[, options])`

Adds links to headings (h1-h6) with an `id`

##### `options`

###### `options.behavior`

`string`, default: `prepend` — How to add a link:

*   `'prepend'` and `'append'` inserts a link with `content`
    in it respectively before or after the heading contents
*   `'wrap'` wraps a link around the current heading contents.

###### `options.properties`

`Object`, default: `{}` if `'wrap'`, `{ariaHidden: true}` otherwise
— Properties for the added link.

###### `options.content`

`Node` or `Array.<Node>`, default: a `span` element with `icon` and `icon-link`
classes — Content to add in link.  Ignored if `'wrap'`

## Related

*   [`rehype-slug`](https://github.com/rehypejs/rehype-slug)

## Contribute

See [`contributing.md` in `rehypejs/rehype`][contribute] for ways to get
started.

This organisation has a [Code of Conduct][coc].  By interacting with this
repository, organisation, or community you agree to abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[travis-badge]: https://img.shields.io/travis/rehypejs/rehype-autolink-headings.svg

[travis]: https://travis-ci.org/rehypejs/rehype-autolink-headings

[codecov-badge]: https://img.shields.io/codecov/c/github/rehypejs/rehype-autolink-headings.svg

[codecov]: https://codecov.io/github/rehypejs/rehype-autolink-headings

[npm]: https://docs.npmjs.com/cli/install

[license]: license

[author]: https://wooorm.com

[rehype]: https://github.com/rehypejs/rehype

[contribute]: https://github.com/rehypejs/rehype/blob/master/contributing.md

[coc]: https://github.com/rehypejs/rehype/blob/master/code-of-conduct.md
