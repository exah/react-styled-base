import React from 'react'
import PropTypes from 'prop-types'
import { isStr, filterObj } from '@exah/utils'
import { isPropValid } from './is-prop-valid'

function filterProps (fn, tagName, props) {
  if (tagName == null) return props
  return filterObj((propName) => fn(propName, tagName), props)
}

const getDisplayName = (comp) =>
  (isStr(comp) ? comp : comp.displayName) || 'Component'

function createBase (defaultComp = 'div', { propName = 'as', ...filterOptions } = {}) {
  const filterFn = isPropValid(filterOptions)

  function BaseComponent (props, ref) {
    const { [propName]: Comp, filterPropsForTagName, ...rest } = props
    const tagName = isStr(Comp) ? Comp : filterPropsForTagName

    return (
      <Comp ref={ref} {...filterProps(filterFn, tagName, rest)} />
    )
  }

  return Object.assign(React.forwardRef(BaseComponent), {
    displayName: `Base(${getDisplayName(defaultComp)})`,
    defaultProps: {
      [propName]: defaultComp
    },
    propTypes: {
      [propName]: PropTypes.oneOfType([ PropTypes.string, PropTypes.func ]),
      filterPropsForTagName: PropTypes.string
    }
  })
}

const Base = createBase('div')

export {
  Base,
  createBase
}
