import React from 'react'
import PropTypes from 'prop-types'
import { isStr, filterObj, always } from '@exah/utils'
import { DEFAULT_ELEMENT, DEFAULT_PROP_NAME, BASE_COMPONENT_ID } from './constants'
import { isBaseComponent } from './is-base-component'

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
  return function createBase (DefaultComp = DEFAULT_ELEMENT, options = {}) {
    const {
      blacklist,
      whitelist,
      isPropValid = filter,
      tagName: defaultCompTagName
    } = options

    const filterFn = createFilter(isPropValid, { whitelist, blacklist })

    function BaseComp ({ [componentProp]: Comp, ...rest }, ref) {
      const tagName = isStr(Comp) ? Comp : (Comp === DefaultComp ? defaultCompTagName : null)
      const filteredPops = { ...filterFn(tagName, rest) }

      if (isBaseComponent(DefaultComp)) {
        return (
          <DefaultComp ref={ref} {...{ [componentProp]: Comp, ...filteredPops }} />
        )
      }

      return (
        <Comp ref={ref} {...filteredPops} />
      )
    }

    return Object.assign(React.forwardRef(BaseComp), {
      displayName: `Base(${getDisplayName(DefaultComp)})`,
      defaultProps: { [componentProp]: DefaultComp },
      propTypes: { [componentProp]: PropTypes.elementType },
      [BASE_COMPONENT_ID]: true
    })
  }
}
