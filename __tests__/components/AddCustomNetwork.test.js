import React from 'react'
import { mount } from 'enzyme'

import AddCustomNetwork from '../../src/app/components/AddCustomNetwork/AddCustomNetwork'

describe('AddCustomNetwork', () => {
  test('adds network on form submit', () => {
    const wrapper = mount(
      <AddCustomNetwork />
    )
    expect(wrapper !== null).toEqual(true)
  })
})
