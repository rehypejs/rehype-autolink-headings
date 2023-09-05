/**
 * @typedef {import('../index.js').Options} Options
 */

import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import test from 'node:test'
import {rehype} from 'rehype'
import {isHidden} from 'is-hidden'
import rehypeAutolinkHeadings from '../index.js'

test('rehypeAutolinkHeadings', async function (t) {
  await t.test('should support functions', async function () {
    const file = await rehype()
      .data('settings', {fragment: true})
      .use(rehypeAutolinkHeadings, {
        behavior: 'after',
        group(node) {
          assert.equal(node.properties.id, 'a')
          return {type: 'element', tagName: 'div', properties: {}, children: []}
        },
        content(node) {
          assert.equal(node.properties.id, 'a')
          return {type: 'element', tagName: 'i', properties: {}, children: []}
        }
      })
      .process('<h1 id=a>b</h1>')

    assert.deepEqual(
      String(file),
      '<div><h1 id="a">b</h1><a href="#a"><i></i></a></div>'
    )
  })
})

test('fixtures', async function (t) {
  const root = new URL('fixtures/', import.meta.url)
  const folders = await fs.readdir(root)
  let index = -1

  while (++index < folders.length) {
    const folder = folders[index]

    if (isHidden(folder)) {
      continue
    }

    await t.test(folder, async function () {
      const folderUrl = new URL(folder + '/', root)
      const input = await fs.readFile(new URL('input.html', folderUrl))
      const output = String(
        await fs.readFile(new URL('output.html', folderUrl))
      )
      /** @type {Options | undefined} */
      let config

      try {
        config = JSON.parse(
          String(await fs.readFile(new URL('config.json', folderUrl)))
        )
      } catch {}

      const file = await rehype()
        .data('settings', {fragment: true})
        .use(rehypeAutolinkHeadings, config)
        .process(input)

      assert.equal(String(file), output)
    })
  }
})
