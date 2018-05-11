import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import style from './StartPage.css'

const StartPage = ({ history }) => {
  return (
    <section className={ style.startPage }>
      <button className={ style.startPageButton } onClick={ () => history.push('/newWallet') }>
        <i className={ `${style.startPageIcon} fas fa-plus` } />
        New Wallet
      </button>
      <button className={ style.startPageButton } onClick={ () => history.push('/login') }>
        <i className={ `${style.startPageIcon} fas fa-sign-in-alt` } />
        Use Saved Wallet
      </button>
      <button className={ style.startPageButton } onClick={ () => history.push('/importWallet') }>
        <i className={ `${style.startPageIcon} fas fa-upload` } />
        Import Wallet
      </button>
    </section>
  )
}

StartPage.propTypes = {
  history: PropTypes.object,
}

export default withRouter(StartPage)
