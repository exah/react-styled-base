import htmlAttributes from '../data/html-attributes.json'

const REACT_PROPS_REGEXP = /^((children)|(on[A-Z].*)|((data|aria)-.*))$/

const isReactProp = (propName) => REACT_PROPS_REGEXP.test(propName)
const isHtmlProp = (propName, tagName) => (
  htmlAttributes['*'].includes(propName) || (
    (htmlAttributes[tagName] || []).includes(propName)
  )
)

function simpleMemoize (fn) {
  const cache = {}

  return (a, b) => {
    const key = a + b

    if (!cache.hasOwnProperty(key)) {
      cache[key] = fn(a, b)
    }

    return cache[key]
  }
}

function createIsPropValid ({ whitelist = [], blacklist = [] } = {}) {
  const checkFn = (tagName, propName) => (
    (whitelist.includes(propName) && !blacklist.includes(propName)) ||
    isReactProp(propName) ||
    isHtmlProp(propName, tagName)
  )

  return simpleMemoize(checkFn)
}

const isPropValid = createIsPropValid()

export {
  createIsPropValid,
  isPropValid
}
