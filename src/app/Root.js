import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ConnectedRouter } from 'react-router-redux'
import { history } from '../app/store/configureStore'
import { Provider } from 'react-redux'
import App from './containers/App'
import PopupWindow from './containers/PopupWindow'

export default class Root extends Component {
  render () {
    const { store, isPopupWindow } = this.props
    return (
      <Provider store={ store }>
        <ConnectedRouter history={ history }>
          { isPopupWindow
            ? <PopupWindow />
            : <App />
          }
        </ConnectedRouter>
      </Provider>
    )
  }
}

Root.propTypes = {
  store: PropTypes.object.isRequired,
  isPopupWindow: PropTypes.bool.isRequired,
}
