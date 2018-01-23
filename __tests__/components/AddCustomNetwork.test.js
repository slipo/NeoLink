import React from 'react'
import configureStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import thunk from 'redux-thunk'
import { mount } from 'enzyme'

import AddCustomNetwork from '../../src/app/components/AddCustomNetwork/AddCustomNetwork'

const setup = () => {
  const store = configureStore([thunk])({})
  const props = {
    addCustomNetwork: jest.fn(),
  }
  const wrapper = mount(
    <AddCustomNetwork />
  )

  return {
    wrapper,
  }
}

describe('AddCustomNetwork', () => {
  test('renders without crashing', (done) => {
    const { wrapper } = setup()
    expect(wrapper).toMatchSnapshot()
    done()
  })

  test('adds network on form submit', () => {
    const { wrapper } = setup()

    const instance = wrapper.instance()

    const networkNameField = wrapper.find('input')
    networkNameField.simulate('change', { target: { value: 'Test Network' } })

    const networkUrlField = wrapper.find('textfield').second().getElement()
    inputFields[0].simulate('change', { target: { value: 'http://127.0.0.1:5000/' } })

    wrapper.find('button').first().simulate('submit')
    expect(instance.props.addCustomNetwork).toHaveBeenCalledWith(0)
  })
})
