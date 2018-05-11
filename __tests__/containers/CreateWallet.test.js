import React from 'react'
import { wallet } from '@cityofzion/neon-js'

import { shallow, mount } from 'enzyme'

import CreateWallet from '../../src/app/containers/CreateWallet/CreateWallet'
import Loader from '../../src/app/components/Loader'

jest.useFakeTimers()

const accounts = {
  ARjkxk6VcKPFKqRHhuLNog9TbdYxhKu9be: {
    address: 'ARjkxk6VcKPFKqRHhuLNog9TbdYxhKu9be',
    isDefault: false,
    key: '6PYRop1b45uKRUVUngUr3g44UmH8Kg6KTVTAvxyKKJLVpxQsM5HXUPrzCB',
    label: 'TestKonto',
  },
}

describe('CreateWallet', () => {
  test('shows loading', () => {
    const wrapper = shallow(<CreateWallet addAccount={ jest.fn } setAccount={ jest.fn } history={ {} } accounts={ accounts } />)
    wrapper.setState({ loading: true })
    expect(wrapper.find(Loader).length).toEqual(1)
  })

  test('Creates valid credentials', done => {
    const passphrase = 'city of zion'

    const preventDefault = jest.fn()
    const addAccount = jest.fn()

    const wrapper = mount(
      <CreateWallet addAccount={ addAccount } setAccount={ jest.fn } history={ {} } accounts={ accounts } />
    )

    wrapper
      .find('input#passPhraseConfirm')
      .simulate('change', { target: { id: 'passPhraseConfirm', value: passphrase } })
    wrapper.find('input#passPhrase').simulate('change', { target: { id: 'passPhrase', value: passphrase } })
    wrapper.find('input#label').simulate('change', { target: { id: 'label', value: 'somelabel' } })
    wrapper.find('button').simulate('click')
    wrapper.find('form').simulate('submit', { preventDefault })

    jest.runAllTimers()

    process.nextTick(() => {
      expect(wrapper.state().errors).toEqual({ label: '', passPhrase: '', passPhraseConfirm: '', wif: '' })
      expect(wrapper.state().encryptedWif).toBeTruthy()
      expect(wrapper.state().address).toBeTruthy()

      expect(wallet.isAddress(wrapper.state().address)).toEqual(true)
      expect(addAccount.mock.calls.length).toBe(1)
      done()
    })
  })

  test('Shows error with non matching passphrases', () => {
    const passphrase = 'city of zion'
    const passphraseConfirm = 'city of paris'

    const preventDefault = jest.fn()

    const wrapper = mount(<CreateWallet addAccount={ jest.fn } setAccount={ jest.fn } history={ {} } accounts={ accounts } />)

    wrapper
      .find('input#passPhraseConfirm')
      .simulate('change', { target: { id: 'passPhraseConfirm', value: passphraseConfirm } })
    wrapper.find('input#passPhrase').simulate('change', { target: { id: 'passPhrase', value: passphrase } })
    wrapper.find('button').simulate('click')
    wrapper.find('form').simulate('submit', { preventDefault })

    jest.runAllTimers()

    expect(wrapper.state().errors.passPhraseConfirm).not.toEqual('')
    expect(wrapper.state().errors.passPhraseConfirm).toEqual('Passphrases do not match.')
  })

  test('passphrase must be at least 10 characters', () => {
    const passphrase = '123456789'

    const preventDefault = jest.fn()

    const wrapper = mount(<CreateWallet addAccount={ jest.fn } setAccount={ jest.fn } history={ {} } accounts={ accounts } />)

    wrapper
      .find('input#passPhraseConfirm')
      .simulate('change', { target: { id: 'passPhraseConfirm', value: passphrase } })
    wrapper.find('input#passPhrase').simulate('change', { target: { id: 'passPhrase', value: passphrase } })
    wrapper.find('button').simulate('click')
    wrapper.find('form').simulate('submit', { preventDefault })

    jest.runAllTimers()

    expect(wrapper.state().errors.passPhrase).not.toEqual('')
    expect(wrapper.state().errors.passPhrase).toEqual('Passphrase must be longer than 10 characters.')
  })

  test('Creates valid credentials with manual WIF', done => {
    const passphrase = 'city of zion'

    const preventDefault = jest.fn()
    const addAccount = jest.fn()

    const wrapper = mount(
      <CreateWallet addAccount={ addAccount } manualWIF setAccount={ jest.fn } history={ {} } accounts={ accounts } />
    )

    wrapper
      .find('input#wif')
      .simulate('change', { target: { id: 'wif', value: 'KxDgvEKzgSBPPfuVfw67oPQBSjidEiqTHURKSDL1R7yGaGYAeYnr' } })
    wrapper
      .find('input#passPhraseConfirm')
      .simulate('change', { target: { id: 'passPhraseConfirm', value: passphrase } })
    wrapper.find('input#passPhrase').simulate('change', { target: { id: 'passPhrase', value: passphrase } })
    // Hack WIF needs to be rewritten
    wrapper.find('input#passPhraseConfirm').simulate('change', { target: { id: 'passPhrase', value: passphrase } })
    wrapper.find('input#label').simulate('change', { target: { id: 'label', value: 'somelabel' } })

    wrapper.find('button').simulate('click')
    wrapper.find('form').simulate('submit', { preventDefault })

    jest.runAllTimers()

    process.nextTick(() => {
      expect(wrapper.state().errors.wif).toEqual('')
      expect(wrapper.state().encryptedWif).toBeTruthy()
      expect(wrapper.state().address).toBeTruthy()

      expect(wallet.isAddress(wrapper.state().address)).toEqual(true)
      expect(wrapper.state().address).toEqual('AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y')
      expect(addAccount.mock.calls.length).toBe(1)
      done()
    })
  })

  test('Shows error with invalid manual WIF', done => {
    const passphrase = 'city of zion'

    const preventDefault = jest.fn()

    const wrapper = mount(
      <CreateWallet addAccount={ jest.fn } manualWIF setAccount={ jest.fn } history={ {} } accounts={ accounts } />
    )

    wrapper
      .find('input#wif')
      .simulate('change', { target: { id: 'wif', value: '!xDgvEKzgSBPPfuVfw67oPQBSjidEiqTHURKSDL1R7yGaGYAeYnr' } })
    wrapper
      .find('input#passPhraseConfirm')
      .simulate('change', { target: { id: 'passPhraseConfirm', value: passphrase } })
    wrapper.find('input#passPhrase').simulate('change', { target: { id: 'passPhrase', value: passphrase } })
    wrapper.find('button').simulate('click')
    wrapper.find('form').simulate('submit', { preventDefault })

    jest.runAllTimers()

    process.nextTick(() => {
      expect(wrapper.state().errors.wif).not.toEqual('')
      done()
    })
  })
})
