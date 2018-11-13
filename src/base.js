import React from 'react'
import PropTypes from 'prop-types'
import { isStr, filterObj } from '@exah/utils'
import { createIsPropValid } from './is-prop-valid'

const ReactComponentPropType = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.func,
  // Special react hocs: `forwardRef`, `memo`
  PropTypes.shape({
    $$typeof: PropTypes.symbol.isRequired,
    render: PropTypes.func.isRequired
  })
])

function defaultFilterPropsFn (fn, tagName, props) {
  if (tagName == null) return props
  return filterObj((propName, propValue) => fn(tagName, propName, propValue), props)
}

const getDisplayName = (comp) =>
  (isStr(comp) ? comp : comp.displayName) || 'Component'

function createBase (defaultComp = 'div', options = {}) {
  const {
    componentProp = 'as',
    filterPropsFn = defaultFilterPropsFn,
    tagName: defaultTagName,
    ...filterOptions
  } = options

  const filterFn = createIsPropValid(filterOptions)

  function BaseComponent ({ [componentProp]: Comp, asTagName, ...rest }, ref) {
    const tagName = isStr(Comp) ? Comp : asTagName

    return (
      <Comp ref={ref} {...filterPropsFn(filterFn, tagName, rest)} />
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

const Base = createBase()

export {
  Base,
  createBase
}
