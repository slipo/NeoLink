import React from 'react'
import { Provider } from 'react-redux'
import { mount } from 'enzyme'
import { createStore, combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'

import LoginForm, { Login } from '../../src/app/components/Login/Login'
import Loader from '../../src/app/components/Loader'

describe('Login', () => {
  let store

  beforeEach(() => {
    store = createStore(combineReducers({ form: formReducer }))
  })

  test('shows loading', (done) => {
    const loginForm = mount(<Provider store={ store }><LoginForm setAccount={ jest.fn } account={ { wif: '' } } /></Provider>)
    loginForm.find(Login).instance().setState({ loading: true }, () => {
      loginForm.update()
      expect(loginForm.find(Loader).length).toEqual(1)
      done()
    })
  })

  test('Returns null if already logged in', () => {
    const preLoggedIn = {
      wif: 'L3moZFQgcpyznreRqbR1uVcvrkARvRqJS4ttGfMdXGaQQR5DeYcZ',
      address: 'AQg2xUAPpA21FZMw44cpErGWekx3Hw8neA',
    }

    const loginForm = mount(<Provider store={ store }><LoginForm setAccount={ jest.fn } account={ preLoggedIn } /></Provider>)
    expect(loginForm.html()).toEqual(null)
  })

  test('Logs in with valid credentials', (done) => {
    const encryptedKey = '6PYKu5U41eVSiym4getQWsfUycsWBHNUR9LmajHisK9FqWSqvfuhsqqaY9'
    const password = 'testing'
    const expectedAddress = 'AQg2xUAPpA21FZMw44cpErGWekx3Hw8neA'
    const expectedWif = 'L3moZFQgcpyznreRqbR1uVcvrkARvRqJS4ttGfMdXGaQQR5DeYcZ'

    const setAccount = jest.fn((wif, address) => {
      expect(wif).toEqual(expectedWif)
      expect(address).toEqual(expectedAddress)
      done()
    })

    const loginForm = mount(<Provider store={ store }><LoginForm setAccount={ setAccount } account={ { wif: '' } } /></Provider>)
    loginForm.find('input[name="encryptedWif"]').simulate('change', { target: { name: 'encryptedWif', value: encryptedKey } })
    loginForm.find('input[name="passPhrase"]').simulate('change', { target: { name: 'passPhrase', value: password } })
    loginForm.find('button').simulate('click')
  })

  test('Shows error with invalid credentials', () => {
    jest.useFakeTimers()

    const encryptedKey = '6PYKu5U41eVSiym4getQWsfUycsWBHNUR9LmajHisK9FqWSqvfuhsqqaY9'
    const password = 'wrong'

    const loginForm = mount(<Provider store={ store }><LoginForm setAccount={ jest.fn() } account={ { wif: '' } } /></Provider>)
    loginForm.find('input[name="encryptedWif"]').simulate('change', { target: { id: 'encryptedWif', value: encryptedKey } })
    loginForm.find('input[name="passPhrase"]').simulate('change', { target: { id: 'passPhrase', value: password } })
    loginForm.find('button').simulate('click')

    jest.runAllTimers()

    const loginState = loginForm.find(Login).instance().state
    expect(loginState.errorMsg).not.toEqual('')
    expect(loginForm.text().includes(loginState.errorMsg)).toEqual(true)
  })
})
