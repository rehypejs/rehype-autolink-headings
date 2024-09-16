import type {Test} from 'hast-util-is-element'
import type {ElementContent, Element, Properties} from 'hast'

/**
 * Behavior.
 */
export type Behavior = 'after' | 'append' | 'before' | 'prepend' | 'wrap'

/**
 * Generate properties.
 *
 * @param element
 *   Heading.
 * @returns
 *   Properties to set on the link.
 */
export type BuildProperties = (element: Readonly<Element>) => Properties

/**
 * Generate content.
 *
 * @param element
 *   Heading.
 * @returns
 *   Content.
 */
export type Build = (
  element: Readonly<Element>
) => Array<ElementContent> | ElementContent

/**
 * Deep clone.
 *
 * See: <https://github.com/microsoft/TypeScript-DOM-lib-generator/issues/1237#issuecomment-1345515448>
 */
export type Cloneable<T> =
  T extends Record<any, any> ? {-readonly [k in keyof T]: Cloneable<T[k]>} : T

/**
 * Configuration.
 */
export interface Options {
  /**
   * How to create links (default: `'prepend'`).
   */
  behavior?: Behavior | null | undefined
  /**
   * Content to insert in the link
   * (default: if `'wrap'` then `undefined`,
   * otherwise `<span class="icon icon-link"></span>`);
   * if `behavior` is `'wrap'` and `Build` is passed,
   * its result replaces the existing content,
   * otherwise the content is added after existing content.
   */
  content?:
    | ReadonlyArray<ElementContent>
    | Readonly<ElementContent>
    | Build
    | null
    | undefined
  /**
   * Content to wrap the heading and link with,
   * if `behavior` is `'after'` or `'before'` (optional).
   */
  group?:
    | ReadonlyArray<ElementContent>
    | Readonly<ElementContent>
    | Build
    | null
    | undefined
  /**
   * Extra properties to set on the heading (optional).
   */
  headingProperties?: Readonly<Properties> | BuildProperties | null | undefined
  /**
   * Extra properties to set on the link when injecting
   * (default: `{ariaHidden: true, tabIndex: -1}` if `'append'` or `'prepend'`,
   * otherwise `undefined`).
   */
  properties?: Readonly<Properties> | BuildProperties | null | undefined
  /**
   * Extra test for which headings are linked (optional).
   */
  test?: Test | null | undefined
}
