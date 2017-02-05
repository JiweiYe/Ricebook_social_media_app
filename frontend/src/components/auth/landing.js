import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import Login from './login'
import Register from './register'

let ErrorMessage = ({error, success}) => (
    <div className="row">
        { error.length == 0 ? '' :
                <div className="alert_landing" id="errorMessage">{ error }</div>
        }
        { success.length == 0 ? '' :
                <div className="alert_landing" id="successMessage">{ success }</div>
        }
    </div>
)
ErrorMessage.propTypes = {
    error: PropTypes.string.isRequired,
    success: PropTypes.string.isRequired
}
ErrorMessage = connect((state) => {
    return { error: state.common.error, success: state.common.success }
})(ErrorMessage)

const Landing = () => (
        <div>
        <div className="pagetitle">
            <center>
            <h1><strong>Welcome to Ricebook</strong></h1>
            </center>
        </div>
        <center className="titlefont">
            <h2>Account Registration</h2>
            <Register/><br/>
            <ErrorMessage/>
            <h2>Login</h2>
            <Login/>
        </center> 
        </div>

)

export default Landing



/** WEBPACK FOOTER **
 ** ./src/components/auth/landing.js
 **/