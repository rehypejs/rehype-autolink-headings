'use strict'

var extend = require('extend')
var has = require('hast-util-has-property')
var rank = require('hast-util-heading-rank')
var visit = require('unist-util-visit')

module.exports = autolink

var splice = [].splice

var contentDefaults = {
  type: 'element',
  tagName: 'span',
  properties: {className: ['icon', 'icon-link']},
  children: []
}

function autolink(options) {
  var settings = options || {}
  var props = settings.properties
  var behavior = settings.behaviour || settings.behavior || 'prepend'
  var content = settings.content || contentDefaults
  var group = settings.group
  var method

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
    if (rank(node) && has(node, 'id')) {
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
    var link = create(node, extend(true, {}, props), toChildren(content, node))
    var nodes = behavior === 'before' ? [link, node] : [node, link]
    var grouping = group && toNode(group, node)

    if (grouping) {
      grouping.children = nodes
      nodes = grouping
    }

    splice.apply(parent.children, [index, 1].concat(nodes))

    return [visit.SKIP, index + nodes.length]
  }

  function wrap(node) {
    node.children = [create(node, extend(true, {}, props), node.children)]

    return [visit.SKIP]
  }

  function toChildren(value, node) {
    var result = toNode(value, node)
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
      children: children
    }
  }
}
