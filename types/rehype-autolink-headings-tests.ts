import unified = require('unified')
import autolinkHeadings = require('rehype-autolink-headings')

unified().use(autolinkHeadings)
unified().use(autolinkHeadings, {behavior: 'prepend'})
unified().use(autolinkHeadings, {behavior: 'append'})
unified().use(autolinkHeadings, {behavior: 'wrap'})
unified().use(autolinkHeadings, {behavior: 'before'})
unified().use(autolinkHeadings, {behavior: 'after'})
unified().use(autolinkHeadings, {properties: {ariaHidden: true, tabIndex: -1}})
unified().use(autolinkHeadings, {
  content: {
    type: 'element',
    tagName: 'span',
    properties: {className: ['icon', 'icon-link']},
    children: []
  }
})
unified().use(autolinkHeadings, {
  content: (_currentHeading) => [
    {
      type: 'element',
      tagName: 'span',
      properties: {className: ['icon', 'icon-link']},
      children: []
    }
  ]
})
unified().use(autolinkHeadings, {
  group: {
    type: 'element',
    tagName: 'span',
    properties: {className: ['icon', 'icon-link']},
    children: []
  }
})
unified().use(autolinkHeadings, {
  group: (_currentHeading) => ({
    type: 'element',
    tagName: 'span',
    properties: {className: ['icon', 'icon-link']},
    children: []
  })
})
