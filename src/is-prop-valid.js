import memoize from 'fast-memoize'
import htmlAttributes from './html-attributes.json'

const REACT_PROPS_REGEXP = /^((children|key|ref)|(on[A-Z].*)|((data|aria)-.*))$/

const isReactProp = (propName) => REACT_PROPS_REGEXP.test(propName)
const isHtmlProp = (propName, tagName) => (
  htmlAttributes['*'].includes(propName) || (
    (htmlAttributes[tagName] || []).includes(propName)
  )
)

function isPropValid ({ whitelist = [], blacklist = [], defaultTagName } = {}) {
  const checkFn = (propName, tagName) => (
    (whitelist.includes(propName) && !blacklist.includes(propName)) ||
    isReactProp(propName) ||
    isHtmlProp(propName, (tagName || defaultTagName))
  )

  return memoize(checkFn)
}

export {
  isPropValid
}
