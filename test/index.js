'use strict'

var fs = require('fs')
var path = require('path')
var bail = require('bail')
var test = require('tape')
var rehype = require('rehype')
var vfile = require('to-vfile')
var negate = require('negate')
var hidden = require('is-hidden')
var autolink = require('..')

test('rehype-autolink-headings', function (t) {
  var root = path.join(__dirname, 'fixtures')

  t.test('fixtures', function (t) {
    fs.readdir(root, function (err, files) {
      bail(err)
      files = files.filter(negate(hidden))
      t.plan(files.length)

      files.forEach(one)
    })

    function one(fixture) {
      var base = path.join(root, fixture)
      var input = vfile.readSync(path.join(base, 'input.html'))
      var output = vfile.readSync(path.join(base, 'output.html'))
      var config

      try {
        config = JSON.parse(fs.readFileSync(path.join(base, 'config.json')))
      } catch (_) {}

      t.test(fixture, function (t) {
        rehype()
          .data('settings', {fragment: true})
          .use(autolink, config)
          .process(input, function (err) {
            t.plan(3)
            t.ifErr(err, 'shouldn’t throw')
            t.equal(input.messages.length, 0, 'shouldn’t warn')
            t.equal(String(input), String(output), 'should match')
          })
      })
    }
  })

  t.test('functions', function (t) {
    t.plan(3)

    rehype()
      .data('settings', {fragment: true})
      .use(autolink, {
        behavior: 'after',
        group: (node) => {
          t.equal(node.properties.id, 'a', 'should pass `node` to `group`')
          return {type: 'element', tagName: 'div', properties: {}, children: []}
        },
        content: (node) => {
          t.equal(node.properties.id, 'a', 'should pass `node` to `content`')
          return {type: 'element', tagName: 'i', properties: {}, children: []}
        }
      })
      .process('<h1 id=a>b</h1>', function (err, file) {
        t.deepEqual(
          [err, file.messages.length, String(file)],
          [null, 0, '<div><h1 id="a">b</h1><a href="#a"><i></i></a></div>']
        )
      })
  })

  t.end()
})
