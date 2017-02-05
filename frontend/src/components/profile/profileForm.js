import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { updateProfile } from './profileActions'

class ProfileForm extends Component {

    componentDidUpdate() {
        if (this.props.error.length == 0) {
            this.email.value = null
            this.zipcode.value = null
            this.password.value = null
            this.pwconf.value = null
        }
    }

    render() { return (
        <form onSubmit={(e) => {
            console.log(this.props.oldZipcode)
            if (e) e.preventDefault()
            const payload = {
                zipcode:this.zipcode.value == this.oldZipcode ? '' : this.zipcode.value,
                email:this.email.value == this.oldEmail ? '' : this.email.value,
                password:this.password.value,
                pwconf:this.pwconf.value,
            }
            this.props.dispatch(updateProfile(payload))
            this.password.value = ''
            this.pwconf.value = ''
        }}>
        <div  id="profileUpdate">
        <center>
            <h2>Current Info</h2>
            <table>
                <tr>
                    <td>
                        <span>Date of Birth</span>
                    </td>
                    <td>
                        <span>{this.props.oldDob}</span>
                    </td>
                </tr>
                <tr>
                    <td>
                        <span>email</span>
                    </td>
                    <td>
                        <input className="form-control" id="email" type="text" placeholder={this.props.oldEmail}
                        ref={(node) => this.email = node }/>
                    </td>
                </tr>
  
                <tr>
                    <td>
                        <span>zipcode</span>
                    </td>
                    <td>    
                        <input className="form-control" id="zipcode" type="text" placeholder={this.props.oldZipcode}
                        ref={(node) => this.zipcode = node }/>
                    </td>
                </tr>
                <tr>
                    <td>
                        <span>password</span>
                    </td>
                    <td>
                        <input className="form-control" id="password" type="password" placeholder="password"
                        ref={(node) => this.password = node }/>
                    </td>
                </tr>
                <tr>
                    <td>
                        <span>password confirmation</span>
                    </td>
                    <td>
                        <input className="form-control" id="pwconf" type="password"placeholder="password"
                        ref={(node) => this.pwconf = node }/>
                    </td>
                </tr>
            </table>               
            <button id = "btn_updateprofile" className="btn btn-primary" type="submit">Update</button>
            <Messages/>
        </center>
        </div>
        </form>
    )}
}

const Messages_ = ({error, success}) => (
        <div>
            { error.length == 0 ? '' :                    
                    <div id="errorMessage">{error}</div>
            }
            { success.length == 0 ? '' :
                    <div id="successMessage">{success}</div>
            }
        </div>
)

Messages_.propTypes = {
    error: PropTypes.string.isRequired,
    success: PropTypes.string.isRequired
}

const Messages = connect(
    (state) => {
        return {
            error: state.common.error,
            success: state.common.success,
        }
    }
)(Messages_)

ProfileForm.propTypes = {
    error: PropTypes.string.isRequired,
    oldZipcode: PropTypes.number.isRequired,
    oldEmail: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    dob:PropTypes.string.isRequired
}

export default connect(
    (state) => {
        return {
            error: state.common.error,
            oldZipcode: state.profile.zipcode,
            oldEmail: state.profile.email,
            oldDob: state.profile.dob,
        }
    }
)(ProfileForm)

export { ProfileForm as PureProfileForm }

