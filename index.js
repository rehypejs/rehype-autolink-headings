import extend from 'extend'
import {hasProperty} from 'hast-util-has-property'
import {headingRank} from 'hast-util-heading-rank'
import {visit} from 'unist-util-visit'

const contentDefaults = {
  type: 'element',
  tagName: 'span',
  properties: {className: ['icon', 'icon-link']},
  children: []
}

export default function rehypeAutolinkHeadings(options = {}) {
  let props = options.properties
  const behavior = options.behaviour || options.behavior || 'prepend'
  const content = options.content || contentDefaults
  const group = options.group
  let method

  if (behavior === 'wrap') {
    method = wrap
  } else if (behavior === 'before' || behavior === 'after') {
    method = around
  } else {
    method = inject

    if (!props) {
      props = {ariaHidden: 'true', tabIndex: -1}
    }
  }

  return transformer

  function transformer(tree) {
    visit(tree, 'element', visitor)
  }

  function visitor(node, index, parent) {
    if (headingRank(node) && hasProperty(node, 'id')) {
      return method(node, index, parent)
    }
  }

  function inject(node) {
    node.children[behavior === 'prepend' ? 'unshift' : 'push'](
      create(node, extend(true, {}, props), toChildren(content, node))
    )

    return [visit.SKIP]
  }

  function around(node, index, parent) {
    const link = create(
      node,
      extend(true, {}, props),
      toChildren(content, node)
    )
    let nodes = behavior === 'before' ? [link, node] : [node, link]
    const grouping = group && toNode(group, node)

    if (grouping) {
      grouping.children = nodes
      nodes = [grouping]
    }

    parent.children.splice(index, 1, ...nodes)

    return [visit.SKIP, index + nodes.length]
  }

  function wrap(node) {
    node.children = [create(node, extend(true, {}, props), node.children)]

    return [visit.SKIP]
  }

  function toChildren(value, node) {
    const result = toNode(value, node)
    return Array.isArray(result) ? result : [result]
  }

  function toNode(value, node) {
    if (typeof value === 'function') return value(node)
    return extend(true, Array.isArray(value) ? [] : {}, value)
  }

  function create(node, props, children) {
    return {
      type: 'element',
      tagName: 'a',
      properties: Object.assign({}, props, {href: '#' + node.properties.id}),
      children
    }
  }
}
