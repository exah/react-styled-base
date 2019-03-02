import React from 'react'
import PropTypes from 'prop-types'
import { isStr, filterObj } from '@exah/utils'
import { DEFAULT_PROP_NAME, BASE_COMPONENT_ID } from './constants'
import { isBaseComponent } from './is-base-component'

function createFilter (fn, { whitelist = [], blacklist = [] }) {
  return (tagName, props) => filterObj(
    (propName) => (
      (whitelist.includes(propName)) ||
      (!blacklist.includes(propName) && (fn ? fn(propName, tagName) : true))
    ),
    props
  )
}

export function createBaseFactory ({
  filter,
  componentProp = DEFAULT_PROP_NAME
} = {}) {
  return function createBase (DefaultComp, options = {}) {
    const shouldExtend = isBaseComponent(DefaultComp)

    const {
      isPropValid = shouldExtend ? null : filter,
      tagName: defaultCompTagName,
      blacklist,
      whitelist
    } = options

    const filterFn = createFilter(isPropValid, { whitelist, blacklist })

    function BaseComp ({ [componentProp]: Comp, ...rest }, ref) {
      const tagName = isStr(Comp) ? Comp : (Comp === DefaultComp ? defaultCompTagName : null)
      const filteredPops = { ...filterFn(tagName, rest) }

      if (shouldExtend) {
        return (
          <DefaultComp ref={ref} {...{ [componentProp]: Comp, ...filteredPops }} />
        )
      }

      return (
        <Comp ref={ref} {...filteredPops} />
      )
    }

    return Object.assign(React.forwardRef(BaseComp), {
      displayName: 'Base',
      defaultProps: { [componentProp]: DefaultComp },
      propTypes: { [componentProp]: PropTypes.elementType },
      [BASE_COMPONENT_ID]: true
    })
  }
}
