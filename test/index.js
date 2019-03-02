import test from 'ava'
import React from 'react'
import { shallow, configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { Base, createBase, isPropValid } from '../src'

configure({ adapter: new Adapter() })

test('render div', t => {
  const tree = shallow(<Base />)

  t.true(tree.equals(<div />))
  t.is(tree.html(), '<div></div>')
})

test('createBase', t => {
  const MyBase = createBase('span')
  const tree = shallow(<MyBase />)

  t.true(tree.equals(<span />))
  t.is(tree.html(), '<span></span>')
})

test('change inner comp', t => {
  const tree = shallow(<Base as='span' />)

  t.true(tree.equals(<span />))
  t.is(tree.html(), '<span></span>')
})

test('add prop valid for all tags', t => {
  const tree = shallow(<Base as='img' id='foo' className='bar' a='ignore' />)

  t.true(tree.equals(<img id='foo' className='bar' />))
  t.is(tree.html(), '<img id="foo" class="bar"/>')
})

test('add prop valid for this tag', t => {
  const tree = shallow(<Base as='input' defaultValue='foo' />)

  t.true(tree.equals(<input defaultValue='foo' />))
  t.is(tree.html(), '<input value="foo"/>')
})

test('ignore prop not valid for this tag', t => {
  const tree = shallow(<Base as='span' value='foo' />)

  t.true(tree.equals(<span />))
  t.is(tree.html(), '<span></span>')
})

const CutsomComp = (props) => <div {...props} />

test('override tag name for custom components', t => {
  const tree = shallow(<Base as={createBase(CutsomComp, { tagName: 'input' })} value='foo' foo='bar' />)

  t.is(tree.html(), '<div value="foo"></div>')
})

test('multiple calls to isPropValid are memoized', t => {
  t.true(isPropValid('href', 'a'))
  t.true(isPropValid('href', 'a'))
})

test('do not filter props for custom components', t => {
  const tree = shallow(<Base as={CutsomComp} value='foo' foo='bar' />)

  t.is(tree.html(), '<div value="foo" foo="bar"></div>')
})

test('createBase inside `as` prop', t => {
  const tree = shallow(
    <Base
      as={createBase(CutsomComp, { tagName: 'a', whitelist: [ 'to' ] })}
      href='foo'
      to='bar'
      value='baz'
      a='foo-bar-baz'
    />
  )

  t.is(tree.html(), '<div href="foo" to="bar"></div>')
})

test('custom filter inside createBase ', t => {
  const Comp = createBase((props) => <span {...props} />, {
    isPropValid: (prop, tag) => prop !== 'foo'
  })

  const tree = shallow(
    <Comp foo='bar' title='baz' />
  )

  t.is(tree.html(), '<span title="baz"></span>')
})

test('blacklist ', t => {
  const Comp = createBase('img', { blacklist: [ 'width' ] })

  const tree = shallow(
    <Comp width={1 / 2} />
  )

  t.is(tree.html(), '<img/>')
})
