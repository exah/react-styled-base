import { REACT_PROPS_REGEXP } from './constants'

export const isReactProp = (propName) => REACT_PROPS_REGEXP.test(propName)
