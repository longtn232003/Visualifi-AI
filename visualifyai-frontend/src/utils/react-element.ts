import { ReactElement, isValidElement } from 'react'

/**
 * Check if element is a valid React Element
 */
export const isReactElement = (element: any): element is ReactElement => {
  return isValidElement(element)
}

/**
 * Check if element is a custom component
 */

export const isCustomComponent = (element: any): boolean => {
  return isValidElement(element) && typeof element.type === 'function'
}

/**
 * Check if element is an HTML element
 */
export const isHtmlElement = (element: any): boolean => {
  return isValidElement(element) && typeof element.type === 'string'
}

/**
 * Check if element is a specific HTML element
 */
export const isSpecificHtmlTag = (element: any, tagName: string): boolean => {
  return isHtmlElement(element) && element.type === tagName.toLowerCase()
}

/**
 * Check if element is a specific component (by name)
 */
export const isComponentWithName = (element: any, name: string): boolean => {
  return isCustomComponent(element) && (element.type.name === name || element.type.displayName === name)
}
