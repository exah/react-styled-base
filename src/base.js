import { DEFAULT_ELEMENT } from './internal/constants'
import { createBaseFactory } from './internal/create-base-factory'
import { isPropValid } from './internal/is-prop-valid'

export const createBase = createBaseFactory({ filter: isPropValid })
export const Base = createBase(DEFAULT_ELEMENT)
