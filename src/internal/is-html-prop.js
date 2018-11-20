import htmlAttributes from '../../data/html-attributes.json'

export const isHtmlProp = (propName, tagName) => (
  htmlAttributes['*'].includes(propName) || (
    (htmlAttributes[tagName] || []).includes(propName)
  )
)
