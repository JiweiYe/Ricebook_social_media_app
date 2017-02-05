import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { connectFB } from './profileActions'

class FacebookLoginSheet extends Component {

	componentDidUpdate() {
        if (this.props.error.length == 0) {
            this.originalUserName.value = null
            this.originalPassword.value = null
        }
    }

    render() { return (
        <form onSubmit={(e) => {
            if (e) e.preventDefault()
            const payload = {
         		originalUserName:this.originalUserName.value,
                originalPassword:this.originalPassword.value
            }
            this.props.dispatch(connectFB(payload))
        }}>
        { !this.props.currentUser.split('@')[1] ? '' :
            <div>
                <div >
                    <label for="originalUserName">Normal Account Username</label>
                    <div >
                        <input type="text" ref={(node) => this.originalUserName = node }/>
                    </div>
                </div>        
                <div >
                    <label for="originalPassword">Normal Account Password</label>
                    <div>
                        <input type="password" ref={(node) => this.originalPassword = node }/>
                    </div>
                </div>
                <div>
                    <div>
                        <button type="submit">Link Normal Account</button>
                    </div>
                </div>
            </div>
        }
    	</form>
    )}
}

FacebookLoginSheet.propTypes = {
    error: PropTypes.string.isRequired,
    currentUser: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired
}

export default connect(
    (state) => {
        return {
            error: state.common.error,
            currentUser: state.profile.username || ''
        }
    }
)(FacebookLoginSheet)

export { FacebookLoginSheet as FacebookLoginSheetForm }