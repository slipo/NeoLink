import React from 'react'

import { shallow, mount } from 'enzyme'

import Login from '../../src/app/components/Login/Login'
import Loader from '../../src/app/components/Loader'

describe('Login', () => {
  test('shows loading', () => {
    const wrapper = shallow(<Login setAccount={ jest.fn } account={ { wif: '' } } />)
    wrapper.setState({ loading: true })
    expect(wrapper.find(Loader).length).toEqual(1)
  })

  test('Returns null if already logged in', () => {
    const preLoggedIn = {
      wif: 'L3moZFQgcpyznreRqbR1uVcvrkARvRqJS4ttGfMdXGaQQR5DeYcZ',
      address: 'AQg2xUAPpA21FZMw44cpErGWekx3Hw8neA',
    }

    const wrapper = shallow(<Login setAccount={ jest.fn } account={ preLoggedIn } />)
    expect(wrapper.html()).toEqual(null)
  })

  test('Logs in with valid credentials', (done) => {
    const encryptedKey = '6PYKu5U41eVSiym4getQWsfUycsWBHNUR9LmajHisK9FqWSqvfuhsqqaY9'
    const password = 'testing'
    const expectedAddress = 'AQg2xUAPpA21FZMw44cpErGWekx3Hw8neA'
    const expectedWif = 'L3moZFQgcpyznreRqbR1uVcvrkARvRqJS4ttGfMdXGaQQR5DeYcZ'

    const preventDefault = jest.fn()

    const setAccount = jest.fn((wif, address) => {
      expect(wif).toEqual(expectedWif)
      expect(address).toEqual(expectedAddress)
      expect(preventDefault).toHaveBeenCalled()
      done()
    })

    const wrapper = mount(<Login setAccount={ setAccount } account={ { wif: '' } } />)

    wrapper.find('input#encryptedWif').simulate('change', { target: { id: 'encryptedWif', value: encryptedKey } })
    wrapper.find('input#passPhrase').simulate('change', { target: { id: 'passPhrase', value: password } })
    wrapper.find('button').simulate('click')
    wrapper.find('form').simulate('submit', { preventDefault })
  })

  test('Shows error with invalid credentials', () => {
    jest.useFakeTimers()

    const encryptedKey = '6PYKu5U41eVSiym4getQWsfUycsWBHNUR9LmajHisK9FqWSqvfuhsqqaY9'
    const password = 'wrong'

    const wrapper = mount(<Login setAccount={ jest.fn() } account={ { wif: '' } } />)

    wrapper.find('input#encryptedWif').simulate('change', { target: { id: 'encryptedWif', value: encryptedKey } })
    wrapper.find('input#passPhrase').simulate('change', { target: { id: 'passPhrase', value: password } })
    wrapper.find('button').simulate('click')
    wrapper.find('form').simulate('submit', { preventDefault: jest.fn() })

    jest.runAllTimers()

    expect(wrapper.state().errorMsg).not.toEqual('')
    expect(wrapper.text().includes(wrapper.state().errorMsg)).toEqual(true)
  })
})
