import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { register } from './authActions'

class Register extends Component {

    componentDidUpdate() {
        if (this.props.error.length == 0) {
            this.email.value = null
            this.phone.value = null
            this.birth.value = null
            this.zipcode.value = null
            this.password.value = null
            this.pwconf.value = null
        }
    }

    render() { return (

        <div id = "register">
            <form onSubmit={(e) => {
                e.preventDefault()
                const payload = {
                    username:this.username.value,
                    displayname:this.displayname.value,
                    email:this.email.value,
                    phone:this.phone.value,
                    birth:this.birth.value,
                    zipcode:this.zipcode.value,
                    password:this.password.value,
                    pwconf:this.pwconf.value
                }
                this.props.dispatch(register(payload))
            }}>
            <div className = "indexbody">
                <table className = "indextable">
                <tr>
                    <td>
                    <span>Account Name:</span>
                    </td>
                    <td>
                        <input type="text" id="accountName" ref={(node) => this.username = node} required/>
                    </td>
                </tr>

                <tr>
                    <td>
                        <span>Display Name(optional):</span>
                    </td>
                    <td>
                        <input type="text" id="displayName" ref={(node) => this.displayname = node}/>
                    </td>
                </tr>

                <tr>
                    <td>
                        <span>Email Address:</span>
                    </td>
                    <td>
                        <input type="email" id="emailAddress" ref={(node) => this.email = node} required/>
                    </td>
                </tr>

                <tr>
                    <td>
                        <span>Phone Number:</span>
                    </td>
                    <td>
                        <input type="text" id="phoneNumber" placeholder = "xxx-xxx-xxxx" ref={(node) => this.phone = node} required/>
                    </td>
                </tr>

                <tr>
                    <td>
                        <span>Date of Birth:</span>
                    </td>
                    <td>
                        <input type="date" format="mm/dd/yyyy" id="idDateofBirth" ref={(node) => this.birth = node} required/>
                    </td>
                </tr>

                <tr>
                    <td>
                        <span>Zipcode:</span>
                    </td>
                    <td>
                        <input type="text" id="zipcode" placeholder = "xxxxx" ref={(node) => this.zipcode = node} required/>
                    </td>
                </tr>

                <tr>
                    <td>
                        <span>Password:</span>
                    </td>
                    <td>
                        <input type="password" id="password" ref={(node) => this.password = node} required/>
                    </td>
                </tr>

                <tr>
                    <td>
                        <span>Password Confirmation:</span>
                    </td>
                    <td>
                        <input type="password" id="passwordConfirmation" ref={(node) => this.pwconf = node} required/>
                    </td>
                </tr>
                </table> 
            </div>  
            <input type="hidden" name="timeStamp" id="idTimeStamp"/>       
            <button type="submit" id="indexSubmit"  class ="inputbtn">Submit</button>
            </form>
        </div>         
    )}
}

export default connect()(Register)



/** WEBPACK FOOTER **
 ** ./src/components/auth/register.js
 **/