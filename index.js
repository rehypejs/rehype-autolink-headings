'use strict';

var xtend = require('xtend');
var visit = require('unist-util-visit');
var has = require('hast-util-has-property');
var is = require('hast-util-is-element');

module.exports = autolink;

var headings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
var methods = {prepend: 'unshift', append: 'push'};
var contentDefaults = {
  type: 'element',
  tagName: 'span',
  properties: {className: ['icon', 'icon-link']}
};

function autolink(processor, options) {
  var settings = options || {};
  var props = settings.properties;
  var behavior = settings.behaviour || settings.behavior || 'prepend';
  var content = settings.content || contentDefaults;
  var fn = behavior === 'wrap' ? wrap : inject;

  if (behavior !== 'wrap' && !props) {
    props = {ariaHidden: true};
  }

  if (content && typeof content === 'object' && !('length' in content)) {
    content = [content];
  }

  return transformer;

  function transformer(tree) {
    visit(tree, visitor);
  }

  function visitor(node) {
    if (is(node, headings) && has(node, 'id')) {
      fn(node);
    }
  }

  function wrap(node) {
    var child = icon(node);
    child.children = node.children;
    node.children = [child];
  }

  function inject(node) {
    var child = icon(node);
    child.children = content.concat();
    node.children[methods[behavior]](child);
  }

  function icon(node) {
    return {
      type: 'element',
      tagName: 'a',
      properties: xtend(props, {href: '#' + node.properties.id})
    };
  }
}
