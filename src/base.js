import { DEFAULT_ELEMENT } from './internal/constants'
import { createBaseFactory } from './internal/create-base-factory'
import { createIsPropValid } from './internal/create-is-prop-valid'

export const createBase = createBaseFactory({ createFilter: createIsPropValid })
export const Base = createBase(DEFAULT_ELEMENT)
