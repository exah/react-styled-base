import React from 'react'
import PropTypes from 'prop-types'
import { isStr, filterObj, always } from '@exah/utils'
import { DEFAULT_ELEMENT, DEFAULT_PROP_NAME } from './constants'

function createFilter (fn, { whitelist = [], blacklist = [] }) {
  return (tagName, props) => filterObj(
    (propName) => (
      (whitelist.includes(propName)) ||
      (!blacklist.includes(propName) && fn(propName, tagName))
    ),
    props
  )
}

const getDisplayName = (comp) =>
  (isStr(comp) ? comp : (comp.displayName || comp.name || 'Component'))

export function createBaseFactory ({
  filter = always(true),
  componentProp = DEFAULT_PROP_NAME
} = {}) {
  return function createBase (defaultComp = DEFAULT_ELEMENT, options = {}) {
    const {
      blacklist,
      whitelist,
      isPropValid = filter,
      tagName: defaultCompTagName
    } = options

    const filterFn = createFilter(isPropValid, { whitelist, blacklist })

    function BaseComponent ({ [componentProp]: Comp, ...rest }, ref) {
      const tagName = isStr(Comp) ? Comp : (Comp === defaultComp ? defaultCompTagName : null)

      return (
        <Comp ref={ref} {...filterFn(tagName, rest)} />
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
