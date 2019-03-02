# react-styled-base

> Base component that prevents rendering unknown props in DOM


- [x] Filter unknown props from DOM
- [x] Based on [`react-html-attributes`](https://www.npmjs.com/package/react-html-attributes) (50% smaller - 3kb when minified /  1kb gziped, without many deprecated attributes & elements)
- [x] Override inner element with `as` prop
- [x] Great for CSS-in-JS component libraries (NOTE: some provide this feature out of box!)


## 📦 Install

```sh
$ yarn add react-styled-base
```


## 📖 API

### `Base` component

```js
import Base from 'react-styled-base'
```


#### Props

- `as: Component` — React component or DOM element (like `div`, `input`, `span`, ...), default `div`

See [`createBase`](#createbase-factory) for more options.


#### Example

```js
import { render } from 'react-dom'
import styled from 'react-emotion'
import Base from 'react-styled-base'

const LinkComp = styled(Base)`
  color: ${props => props.foo === 'bar' ? 'royalblue' : 'hotpink'};
`

render((
  <LinkComp as='a' href='http://example.com' foo='bar' abc='xyz'>
    Click Me
  </LinkComp>
), document.body)

// → 
// <a class="css-0" href="http://example.com">Click Me</a>
```


### `createBase` factory

```js
import { createBase } from 'react-styled-base'
```

#### Params

- `defaultComp: Component` — React component or DOM element (like `div`, `input`, `span`, ...), default `div`
- `options: Object` — (Optional, default to `{ componentProp: 'as' }`)
    + `options.whitelist: Array` — List of props that always will be rendered (optional)
    + `options.blacklist: Array` — List of props that always be be omitted (optional)
    + `options.isPropValid: function (tagName, propName) => boolean` — Custom function to filter props
    + `options.tagName: string` — DOM element. Used when `defaultComp` is not DOM element (optional)

**Return: `Component`** — wrapped in `React.forwardRef`.


#### Example

```js
import { render } from 'react-dom'
import styled from 'react-emotion'
import { Link as RouterLink } from 'react-router-dom'
import { createBase } from 'react-styled-base'

const LinkComp = styled(createBase('span'))`
  color: ${props => props.foo === 'bar' ? 'royalblue' : 'hotpink'};
`

const RouterLinkBase = createBase(RouterLink, {
  tagName: 'a',
  whitelist: [ 'to' ]
})

const CustomComp = createBase((props) => <span {...props} />, { 
  isPropValid: (tag, prop) => prop !== 'foo' 
})

render((
  <span>
    <LinkComp as={RouterLinkBase} to='/page-2' foo='bar'>
      Page 2
    </LinkComp>
    <LinkComp as='a' href='https://google.com' target='_blank' foo='baz'>
      Search
    </LinkComp>
    <CustomComp title='notice' foo='bar'>
      Notice
    </CustomComp
  </span>
), document.body)

// →
// <span>
//   <a class="css-0" href="/app/page-2">Page 2</a>
//   <a class="css-1" href="https://google.com" target="_blank">Search</a>
//   <span title="notice">Notice</span>
// </span>
```


### `isPropValid` function

```js
import { isPropValid } from 'react-styled-base'
```


#### Params

- `propName: string` — prop name (like `href`, `value`, `onChange`)
- `tagName: string` — DOM element (like `a`, `input`, `div`)

**Return: `boolean`**


#### Example

```js
import { isPropValid } from 'react-styled-base'

isPropValid('foo', 'a') // → false
isPropValid('bar', 'a') // → false
isPropValid('href', 'a') // → true
```

## 💁‍♂️ Alternative

- [`clean-element`](https://github.com/jxnblk/styled-system/tree/master/packages/clean-element) — Use component prop-types as blacklist

## 🔗 Links

- ⚠️ [Unknown Prop Warning](https://reactjs.org/warnings/unknown-prop.html)
- 💬 [Separate HTML attributes from styling props](https://github.com/styled-components/styled-components/issues/439)
- 💄 [`pss`](https://github.com/exah/pss) — Prop Styles System
- 📐 [`pss-components`](https://github.com/exah/components) — Components
- 💄 [`glamorous`](https://github.com/paypal/glamorous) — Inspired by
- 👩‍🎤 [`@emotion/is-prop-valid`](https://github.com/emotion-js/next/tree/master/packages/is-prop-valid) — Approach used inside `emotion` and `styled-components`

---

MIT © [John Grishin](http://johngrish.in)
