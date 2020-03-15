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

test('rehype-autolink-headings', function(t) {
  var root = path.join(__dirname, 'fixtures')

  fs.readdir(root, function(err, files) {
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

    rehype()
      .data('settings', {fragment: true})
      .use(autolink, config)
      .process(input, function(err) {
        t.test(fixture, function(st) {
          st.plan(3)
          st.ifErr(err, 'shouldn’t throw')
          st.equal(input.messages.length, 0, 'shouldn’t warn')
          st.equal(String(input), String(output), 'should match')
        })
      })
  }
})
