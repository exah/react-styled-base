import React from 'react'
import PropTypes from 'prop-types'
import { isStr, isFn, filterObj } from '@exah/utils'
import { DEFAULT_ELEMENT, DEFAULT_PROP_NAME } from './constants'

const filterProps = (filter, tagName, props) => filterObj(
  (propName) => filter(tagName, propName),
  props
)

const getDisplayName = (comp) =>
  (isStr(comp) ? comp : (comp.displayName || comp.name || 'Component'))

export function createBaseFactory (createFilter) {
  return function createBase (defaultComp = DEFAULT_ELEMENT, options = {}) {
    const {
      componentProp = DEFAULT_PROP_NAME,
      tagName: compTagName,
      isPropValid: customFilter,
      ...filterOptions
    } = options

    const isCustomFilter = isFn(customFilter)
    const filter = isCustomFilter ? customFilter : createFilter(filterOptions)

    function BaseComponent ({ [componentProp]: Comp, ...rest }, ref) {
      const tagName = isStr(Comp) ? Comp : compTagName

      return (
        <Comp ref={ref} {...filterProps(filter, tagName, rest)} />
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
