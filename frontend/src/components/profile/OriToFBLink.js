import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { oriToFBlink } from './profileActions'

class OriToFBlink extends Component {

	render() { return (

		<div>
		{ this.props.currentUser.split('@')[1] ? '' :
            <div >
                <button type="button" 
      			onClick = {() => {this.props.dispatch(oriToFBlink())}}>Link To Facebook</button>
            </div>    
	    }
	    </div>
	)}
}

OriToFBlink.propTypes = {
		currentUser: PropTypes.string.isRequired
}

export default connect(
	(state) => {
		return {
			currentUser: state.profile.username || ''
		}
	}
)(OriToFBlink)
