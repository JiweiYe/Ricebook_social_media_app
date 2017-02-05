import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { updateHeadline } from '../profile/profileActions'
import { navToMain, navToProfile } from '../../actions'
import { logout } from '../auth/authActions'

class Headline extends Component {

    render() { return (
        <div>
            <img src={ this.props.avatar }/>
            <p id="main_username" className = "username">{ this.props.username }</p>
            <p id="main_headline" className = "headline">{ this.props.headline }</p>
            <div>
                <div>
                    <p><input className="headfield" id="new_headline" type="text"
                        placeholder="update your headline"
                        ref={ (node) => { this.newHeadline = node }}
                        onChange={() => this.forceUpdate()} /></p>
                </div>
                { 
                    <div>
                        <button className="udtbtn" type="button" value="Update your Headline"
                        id = "btn_updateheadline"
                            onClick={() => {
                                this.props.dispatch(updateHeadline(this.newHeadline.value))
                                this.newHeadline.value = ''
                            }}>Update</button>
                    </div>
                }
            </div>
        </div>
    )}
}
export default connect(
    (state) => {
        return {
            username: state.profile.username,
            headline: state.profile.headline,
            avatar: state.profile.avatar
        }
    }
)(Headline)



/** WEBPACK FOOTER **
 ** ./src/components/main/headline.js
 **/