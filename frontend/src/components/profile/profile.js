import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import ProfileForm from './profileForm'
import Avatar from './avatar'
import FacebookLoginSheet from './FacebookLoginSheet'
import DisconnectFB from './DisconnectFB'
import OriToFBLink from './OriToFBLink'


const Profile = () => {
    return(
    <div>
        <div className="pagetitle">
            <center>
            <h1><strong>Profile Page</strong></h1>
            </center>
        </div>
        <div id="profilefunction" className = "border">
            <Avatar/>
        </div>

        <div id = "right_part">    
            <ProfileForm/>
            <br/>
            <br/>
            <div>
            <center>
            <h2>Third Party Account</h2>
            <FacebookLoginSheet/>
            <br/>
            <DisconnectFB/>
            <br/>
            <OriToFBLink/>
            <br/>
            </center>
            </div>
        </div>
    </div>
)}
export default Profile

