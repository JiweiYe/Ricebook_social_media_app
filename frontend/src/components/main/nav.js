import React from 'react'
import { connect } from 'react-redux'
import { navToMain, navToProfile } from '../../actions'
import { logout } from '../auth/authActions'

const Nav = ({username, onProfile, dispatch}) => (
      <div>
        { username.length == 0 ? '' :
          <div>
              { onProfile ?
                <button href="#" onClick={() => { dispatch(navToMain()) }}>Home</button> :
                <button href="#" id = 'btn_toprofile' onClick={() => { dispatch(navToProfile()) }}>Profile</button>
              }
              <button id='logoutbtn' href="#" onClick={() => { dispatch(logout()) }}>Log out {username} </button>
          </div>
        }
      </div>
)

export default connect(
  (state) => {
    return {
      username: state.profile.username || '',
      onProfile: state.common.location == 'profile' }
  })(Nav)



/** WEBPACK FOOTER **
 ** ./src/components/main/nav.js
 **/