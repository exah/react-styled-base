import { memoize } from '@exah/utils'
import { isReactProp } from './is-react-prop'
import { isHtmlProp } from './is-html-prop'

export const isPropValid = memoize(
  function isPropValid (propName, tagName) {
    return (
      isReactProp(propName) || (tagName == null || isHtmlProp(propName, tagName))
    )
  }
)
