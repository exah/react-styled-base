import memoize from 'fast-memoize'
import htmlAttributes from '../data/html-attributes.json'

const REACT_PROPS_REGEXP = /^((children)|(on[A-Z].*)|((data|aria)-.*))$/

const isReactProp = (propName) => REACT_PROPS_REGEXP.test(propName)
const isHtmlProp = (propName, tagName) => (
  htmlAttributes['*'].includes(propName) || (
    (htmlAttributes[tagName] || []).includes(propName)
  )
)

function createIsPropValid ({ whitelist = [], blacklist = [] } = {}) {
  const checkFn = (tagName, propName) => (
    (whitelist.includes(propName) && !blacklist.includes(propName)) ||
    isReactProp(propName) ||
    isHtmlProp(propName, tagName)
  )

  return memoize(checkFn)
}

const isPropValid = createIsPropValid()

export {
  createIsPropValid,
  isPropValid
}
