import React from 'react'
import PropTypes from 'prop-types'
import { isStr, filterObj } from '@exah/utils'
import { isPropValid } from './is-prop-valid'

function defaultFilterPropsFn (fn, tagName, props) {
  if (tagName == null) return props
  return filterObj((propName) => fn(propName, tagName), props)
}

const getDisplayName = (comp) =>
  (isStr(comp) ? comp : comp.displayName) || 'Component'

function createBase (defaultComp = 'div', options = {}) {
  const {
    componentProp = 'as',
    filterPropsFn = defaultFilterPropsFn,
    tagNameForComponent,
    ...filterOptions
  } = options

  const filterFn = isPropValid(filterOptions)

  function BaseComponent ({ [componentProp]: Comp, ...rest }, ref) {
    const tagName = isStr(Comp) ? Comp : rest.tagNameForComponent

    return (
      <Comp ref={ref} {...filterPropsFn(filterFn, tagName, rest)} />
    )
  }

  return Object.assign(React.forwardRef(BaseComponent), {
    displayName: `Base(${getDisplayName(defaultComp)})`,
    defaultProps: {
      [componentProp]: defaultComp,
      tagNameForComponent
    },
    propTypes: {
      [componentProp]: PropTypes.oneOfType([ PropTypes.string, PropTypes.func ]),
      tagNameForComponent: PropTypes.string
    }
  })
}

const Base = createBase('div')

export {
  Base,
  createBase
}
