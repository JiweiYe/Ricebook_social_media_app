import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { disconnectFB } from './profileActions'

class DisconnectFB extends Component {

	render() { return (
		<div>
			{this.props.currentUser.split('@')[1] ? '' :
	            <div>
	            	<button type="button" 
	                	onClick = {() => {this.props.dispatch(disconnectFB())}}>UnLink Accounts</button>
	            </div>
		    }
	    </div>
	)}
}

DisconnectFB.propTypes = {
		currentUser: PropTypes.string.isRequired
}

export default connect(
	(state) => {
		return {
			currentUser: state.profile.username || ''
		}
	}
)(DisconnectFB)

