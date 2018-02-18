import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { wallet } from '@cityofzion/neon-js'

import { Button } from 'rmwc/Button'
import { TextField } from 'rmwc/TextField'
import '@material/button/dist/mdc.button.min.css'
import '@material/textfield/dist/mdc.textfield.min.css'

import Loader from '../Loader'

export default class Login extends Component {
  state = {
    errorMsg: '',
    loading: false,
    encryptedWif: '',
    passPhrase: '',
  }

  _handleTextFieldChange = (e) => {
    const key = e.target.id
    this.setState({
      [key]: e.target.value,
    })
  }

  handleSubmit = (event) => {
    event.preventDefault()

    const { encryptedWif, passPhrase } = this.state
    this.setState({
      loading: true,
      errorMsg: '',
    })

    // Make wallet.decrypt() async.
    setTimeout(() => {
      try {
        const { setAccount } = this.props

        const wif = wallet.decrypt(encryptedWif, passPhrase)
        const account = new wallet.Account(wif)

        this.setState({ loading: false })
        setAccount(wif, account.address)
      } catch (e) {
        this.setState({ loading: false, errorMsg: e.message })
      }
    }, 500)
  }

  render() {
    const { loading, errorMsg } = this.state
    const { account } = this.props

    if (loading) {
      return (
        <Loader />
      )
    }
    if (account.wif !== '') {
      return null
    }
    return (
      <div>
        <form onSubmit={ this.handleSubmit }>
          <TextField
            type='text'
            placeholder='Encrypted WIF'
            value={ this.state.encryptedWif }
            id='encryptedWif'
            onChange={ this._handleTextFieldChange }
          />
          <TextField
            type='password'
            placeholder='Passphrase'
            value={ this.state.passPhrase }
            id='passPhrase'
            onChange={ this._handleTextFieldChange }
          />
          <div>
            <Button raised ripple>Login</Button>
          </div>
        </form>
        {errorMsg !== '' &&
          <div>ERROR: {errorMsg}</div>
        }
      </div>
    )
  }
}

Login.propTypes = {
  setAccount: PropTypes.func.isRequired,
  account: PropTypes.object.isRequired,
}
