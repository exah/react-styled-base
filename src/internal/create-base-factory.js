import React from 'react'
import PropTypes from 'prop-types'
import { isStr, isFn, filterObj } from '@exah/utils'
import { DEFAULT_ELEMENT, DEFAULT_PROP_NAME } from './constants'

const ReactComponentPropType = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.func,
  // Special react hocs: `forwardRef`, `memo`
  PropTypes.shape({
    $$typeof: PropTypes.symbol.isRequired,
    render: PropTypes.func.isRequired
  })
])

const filterProps = (filter, tagName, props, isCustomFilter = false) => {
  if (tagName == null && isCustomFilter === false) return props
  return filterObj((propName) => filter(tagName, propName), props)
}

const getDisplayName = (comp) =>
  (isStr(comp) ? comp : comp.displayName) || 'Component'

export function createBaseFactory (createFilter) {
  return function createBase (defaultComp = DEFAULT_ELEMENT, options = {}) {
    const {
      componentProp = DEFAULT_PROP_NAME,
      tagName: defaultTagName,
      whitelist,
      blacklist,
      isPropValid: customFilter
    } = options

    const isCustomFilter = isFn(customFilter)
    const filter = isCustomFilter ? customFilter : createFilter({ whitelist, blacklist })

    function BaseComponent ({ [componentProp]: Comp, asTagName, ...rest }, ref) {
      const tagName = isStr(Comp) ? Comp : asTagName

      return (
        <Comp ref={ref} {...filterProps(filter, tagName, rest, isCustomFilter)} />
      )
    }

    return Object.assign(React.forwardRef(BaseComponent), {
      displayName: `Base(${getDisplayName(defaultComp)})`,
      defaultProps: {
        [componentProp]: defaultComp,
        asTagName: defaultTagName
      },
      propTypes: {
        [componentProp]: ReactComponentPropType,
        asTagName: PropTypes.string
      }
    })
  }
}
