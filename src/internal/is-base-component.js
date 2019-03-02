import { BASE_COMPONENT_ID } from './constants'

export function isBaseComponent (Comp) {
  if (Comp) {
    return (
      Comp[BASE_COMPONENT_ID] === true ||
      isBaseComponent(Comp.__emotion_base)
    )
  }

  return false
}
