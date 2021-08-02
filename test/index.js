/**
 * @typedef {import('../index.js').Options} Options
 */

import fs from 'fs'
import path from 'path'
import {bail} from 'bail'
import test from 'tape'
import {rehype} from 'rehype'
import {readSync} from 'to-vfile'
import {isHidden} from 'is-hidden'
import rehypeAutolinkHeadings from '../index.js'

test('rehypeAutolinkHeadings', (t) => {
  const root = path.join('test', 'fixtures')

  t.test('fixtures', (t) => {
    fs.readdir(root, (error, files) => {
      bail(error)

      const visible = files.filter((d) => !isHidden(d))

      t.plan(visible.length)

      let index = -1

      while (++index < visible.length) {
        one(visible[index])
      }
    })

    /**
     * @param {string} fixture
     */
    function one(fixture) {
      const base = path.join(root, fixture)
      const input = readSync(path.join(base, 'input.html'))
      const output = readSync(path.join(base, 'output.html'))
      /** @type {Options|undefined} */
      let config

      try {
        config = JSON.parse(
          String(fs.readFileSync(path.join(base, 'config.json')))
        )
      } catch {}

      t.test(fixture, (t) => {
        rehype()
          .data('settings', {fragment: true})
          .use(rehypeAutolinkHeadings, config)
          .process(input, (error) => {
            t.plan(3)
            t.ifErr(error, 'shouldn’t throw')
            t.equal(input.messages.length, 0, 'shouldn’t warn')
            t.equal(String(input), String(output), 'should match')
          })
      })
    }
  })

  t.test('functions', (t) => {
    t.plan(3)

    rehype()
      .data('settings', {fragment: true})
      .use(rehypeAutolinkHeadings, {
        behavior: 'after',
        group: (node) => {
          t.equal(
            node.properties && node.properties.id,
            'a',
            'should pass `node` to `group`'
          )
          return {type: 'element', tagName: 'div', properties: {}, children: []}
        },
        content: (node) => {
          t.equal(
            node.properties && node.properties.id,
            'a',
            'should pass `node` to `content`'
          )
          return {type: 'element', tagName: 'i', properties: {}, children: []}
        }
      })
      .process('<h1 id=a>b</h1>', (error, file) => {
        t.deepEqual(
          [error, (file || {messages: []}).messages.length, String(file)],
          [null, 0, '<div><h1 id="a">b</h1><a href="#a"><i></i></a></div>']
        )
      })
  })

  t.end()
})
