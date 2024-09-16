/**
 * @import {ElementContent, Element, Properties, Root} from 'hast'
 * @import {Visitor} from 'unist-util-visit'
 * @import {BuildProperties, Build, Cloneable, Options} from './types.js'
 */

import structuredClone from '@ungap/structured-clone'
import {headingRank} from 'hast-util-heading-rank'
import {convertElement} from 'hast-util-is-element'
import {SKIP, visit} from 'unist-util-visit'

/** @type {Element} */
const contentDefaults = {
  type: 'element',
  tagName: 'span',
  properties: {className: ['icon', 'icon-link']},
  children: []
}

/** @type {Options} */
const emptyOptions = {}

/**
 * Add links from headings back to themselves.
 *
 * ###### Notes
 *
 * This plugin only applies to headings with `id`s.
 * Use `rehype-slug` to generate `id`s for headings that don’t have them.
 *
 * Several behaviors are supported:
 *
 * *   `'prepend'` (default) — inject link before the heading text
 * *   `'append'` — inject link after the heading text
 * *   `'wrap'` — wrap the whole heading text with the link
 * *   `'before'` — insert link before the heading
 * *   `'after'` — insert link after the heading
 *
 * @param {Readonly<Options> | null | undefined} [options]
 *   Configuration (optional).
 * @returns
 *   Transform.
 */
export default function rehypeAutolinkHeadings(options) {
  const settings = options || emptyOptions
  let properties = settings.properties
  const headingOroperties = settings.headingProperties
  const behavior = settings.behavior || 'prepend'
  const content = settings.content
  const group = settings.group
  const is = convertElement(settings.test)

  /** @type {Visitor<Element>} */
  let method

  if (behavior === 'after' || behavior === 'before') {
    method = around
  } else if (behavior === 'wrap') {
    method = wrap
  } else {
    method = inject

    if (!properties) {
      properties = {ariaHidden: 'true', tabIndex: -1}
    }
  }

  /**
   * Transform.
   *
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  return function (tree) {
    visit(tree, 'element', function (node, index, parent) {
      if (headingRank(node) && node.properties.id && is(node, index, parent)) {
        Object.assign(node.properties, toProperties(headingOroperties, node))
        return method(node, index, parent)
      }
    })
  }

  /** @type {Visitor<Element>} */
  function inject(node) {
    const children = toChildren(content || contentDefaults, node)
    node.children[behavior === 'prepend' ? 'unshift' : 'push'](
      create(node, toProperties(properties, node), children)
    )

    return [SKIP]
  }

  /** @type {Visitor<Element>} */
  function around(node, index, parent) {
    /* c8 ignore next -- uncommon */
    if (typeof index !== 'number' || !parent) return

    const children = toChildren(content || contentDefaults, node)
    const link = create(node, toProperties(properties, node), children)
    let nodes = behavior === 'before' ? [link, node] : [node, link]

    if (group) {
      const grouping = toNode(group, node)

      if (grouping && !Array.isArray(grouping) && grouping.type === 'element') {
        grouping.children = nodes
        nodes = [grouping]
      }
    }

    parent.children.splice(index, 1, ...nodes)

    return [SKIP, index + nodes.length]
  }

  /** @type {Visitor<Element>} */
  function wrap(node) {
    /** @type {Array<ElementContent>} */
    let before = node.children
    /** @type {Array<ElementContent> | ElementContent} */
    let after = []

    if (typeof content === 'function') {
      before = []
      after = content(node)
    } else if (content) {
      after = clone(content)
    }

    node.children = [
      create(
        node,
        toProperties(properties, node),
        Array.isArray(after) ? [...before, ...after] : [...before, after]
      )
    ]

    return [SKIP]
  }
}

/**
 * Deep clone.
 *
 * @template T
 *   Kind.
 * @param {T} thing
 *   Thing to clone.
 * @returns {Cloneable<T>}
 *   Cloned thing.
 */
function clone(thing) {
  // Cast because it’s mutable now.
  return /** @type {Cloneable<T>} */ (structuredClone(thing))
}

/**
 * Create an `a`.
 *
 * @param {Readonly<Element>} node
 *   Related heading.
 * @param {Properties | undefined} properties
 *   Properties to set on the link.
 * @param {Array<ElementContent>} children
 *   Content.
 * @returns {Element}
 *   Link.
 */
function create(node, properties, children) {
  return {
    type: 'element',
    tagName: 'a',
    properties: {...properties, href: '#' + node.properties.id},
    children
  }
}

/**
 * Turn into children.
 *
 * @param {Readonly<ElementContent> | ReadonlyArray<ElementContent> | Build} value
 *   Content.
 * @param {Readonly<Element>} node
 *   Related heading.
 * @returns {Array<ElementContent>}
 *   Children.
 */
function toChildren(value, node) {
  const result = toNode(value, node)
  return Array.isArray(result) ? result : [result]
}

/**
 * Turn into a node.
 *
 * @param {Readonly<ElementContent> | ReadonlyArray<ElementContent> | Build} value
 *   Content.
 * @param {Readonly<Element>} node
 *   Related heading.
 * @returns {Array<ElementContent> | ElementContent}
 *   Node.
 */
function toNode(value, node) {
  if (typeof value === 'function') return value(node)
  return clone(value)
}

/**
 * Turn into properties.
 *
 * @param {Readonly<Properties> | BuildProperties | null | undefined} value
 *   Properties.
 * @param {Readonly<Element>} node
 *   Related heading.
 * @returns {Properties}
 *   Properties.
 */
function toProperties(value, node) {
  if (typeof value === 'function') return value(node)
  return value ? clone(value) : {}
}
