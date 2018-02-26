import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { reducer as formReducer } from 'redux-form'

import account from './account'
import config from './config'

export default combineReducers({
  account,
  config,
  form: formReducer,
  router: routerReducer,
})
