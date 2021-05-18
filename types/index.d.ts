// Minimum TypeScript Version: 3.5
import {Plugin} from 'unified'
import {Element, Node, Properties} from 'hast'

/**
 * Automatically add links to headings.
 */
declare const autolinkHeadings: Plugin<[autolinkHeadings.Options?]>

declare namespace autolinkHeadings {
  interface Options {
    /**
     * How to create links.
     *
     * @default 'prepend'
     */
    behavior?: 'prepend' | 'append' | 'wrap' | 'before' | 'after'

    /**
     * Extra properties to set on the link.
     *
     * @default {ariaHidden: true, tabIndex: -1}
     */
    properties?: Properties | Properties[]

    /**
     * `hast` nodes to insert in the link.
     *
     * @default { type: 'element', tagName: 'span', properties: {className: ['icon', 'icon-link']}, children: [] }
     */
    content?: Node | ((heading: Element) => Node[])

    /**
     * `hast` node to wrap the heading and link with, if `behavior` is
     * `'before'` or `'after'`. There is no default.
     */
    group?: Node | ((heading: Element) => Node)
  }
}

export = autolinkHeadings
