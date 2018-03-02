import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { wallet } from '@cityofzion/neon-js'
import { Field, reduxForm } from 'redux-form'

import { Button } from 'rmwc/Button'
import { TextField } from 'rmwc/TextField'
import '@material/button/dist/mdc.button.min.css'
import '@material/textfield/dist/mdc.textfield.min.css'

import Loader from '../Loader'

export class Login extends Component {
  state = {
    errorMsg: '',
    loading: false,
    encryptedWif: '',
    passPhrase: '',
  }

  _renderTextField = ({
    input,
    ...rest
  }) => (
    <TextField
      { ...input }
      { ...rest }
      onChange={ (event) => input.onChange(event.target.value) }
    />
  )

  handleSubmit = (values, dispatch, formProps) => {
    const { reset } = formProps
    const encryptedWif = values.encryptedWif
    const passPhrase = values.passPhrase

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
        reset()
        setAccount(wif, account.address)
      } catch (e) {
        this.setState({ loading: false, errorMsg: e.message })
      }
    }, 500)
  }

  render() {
    const { loading, errorMsg } = this.state
    const { account, handleSubmit } = this.props

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
        <form onSubmit={ handleSubmit(this.handleSubmit) }>
          <Field
            component={ this._renderTextField }
            type='text'
            name='encryptedWif'
            placeholder='Encrypted WIF'
          />
          <Field
            component={ this._renderTextField }
            type='password'
            placeholder='Passphrase'
            name='passPhrase'
            id='passPhrase'
          />
          <div>
            <Button raised ripple onClick={ handleSubmit(this.handleSubmit) }>Login</Button>
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
  handleSubmit: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
}

export default reduxForm({ form: 'login', destroyOnUnmount: false })(Login)
