import { memoize } from '@exah/utils'
import { isReactProp } from './is-react-prop'
import { isHtmlProp } from './is-html-prop'

export function createIsPropValid ({ whitelist = [], blacklist = [] } = {}) {
  const checkFn = (tagName, propName) => (
    (whitelist.includes(propName) && !blacklist.includes(propName)) ||
    isReactProp(propName) ||
    isHtmlProp(propName, tagName)
  )

  return memoize(checkFn)
}
