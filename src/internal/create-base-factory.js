import React from 'react'
import PropTypes from 'prop-types'
import { isStr, isFn, filterObj, always } from '@exah/utils'
import { DEFAULT_ELEMENT, DEFAULT_PROP_NAME } from './constants'

const filterProps = (fn, tagName, props) => filterObj(
  (propName) => fn(propName, tagName),
  props
)

const getDisplayName = (comp) =>
  (isStr(comp) ? comp : (comp.displayName || comp.name || 'Component'))

export function createBaseFactory ({
  createFilter,
  filter = always(true),
  componentProp = DEFAULT_PROP_NAME
} = {}) {
  return function createBase (defaultComp = DEFAULT_ELEMENT, options = {}) {
    const {
      blacklist,
      whitelist,
      isPropValid = isFn(createFilter) ? createFilter({ whitelist, blacklist }) : filter,
      tagName: defaultCompTagName
    } = options

    function BaseComponent ({ [componentProp]: Comp, ...rest }, ref) {
      const tagName = isStr(Comp) ? Comp : (Comp === defaultComp ? defaultCompTagName : null)

      return (
        <Comp ref={ref} {...filterProps(isPropValid, tagName, rest)} />
      )
    }

    return Object.assign(React.forwardRef(BaseComponent), {
      displayName: `Base(${getDisplayName(defaultComp)})`,
      defaultProps: {
        [componentProp]: defaultComp
      },
      propTypes: {
        [componentProp]: PropTypes.elementType
      }
    })
  }
}
