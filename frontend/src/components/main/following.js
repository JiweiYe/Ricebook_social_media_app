import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { addFollower, delFollower, dispatch } from './followingActions'

const Follower = ({name, avatar, headline, dispatch}) => (
    <div className="row" name="follower">
            <img src={ avatar }/>
            <div><strong>{ name }</strong></div>
            <div><em>{ headline }</em></div>
            <button className = "btn_unfollow"
            onClick={() => { dispatch(delFollower(name)) }}>Unfollow</button>
            <div>&nbsp;</div>
    </div>
)

Follower.propTypes = {
    name: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    headline: PropTypes.string,
    dispatch: PropTypes.func.isRequired
}

class Following extends Component {
    render() { return (
        <div>
                <div>
                <input type="text"
                        id = "text_follower"
                        placeholder="Add A follower"
                        ref={(node) => this.newFollower = node }
                        onChange={(e) => {
                            this.forceUpdate()
                        }}/>
                { !(this.newFollower && this.newFollower.value && this.newFollower.value.length > 0) ? '' :
                    <button
                        id = "btn_addfollower"
                        onClick={() => {
                            this.props.dispatch(addFollower(this.newFollower.value))
                            this.newFollower.value = ''
                            this.forceUpdate()
                        }}>Add Follower</button>
                }
                { this.props.error.length == 0 ? '' :
                    <div>
                        { this.props.error }
                    </div>
                }
                </div>
                <br/><br/>
                { Object.keys(this.props.followers).sort().map((f) => this.props.followers[f]).map((follower) =>
                    <Follower key={follower.name}
                        name={follower.name} avatar={follower.avatar} headline={follower.headline}
                        dispatch={this.props.dispatch} />
                )}


        </div>
    )}
}

Following.propTypes = {
    error: PropTypes.string.isRequired,
    followers: PropTypes.object.isRequired
}

export default connect(
    (state) => {
        return {
            error: state.common.error,
            followers: state.followers.followers
        }
    }
)(Following)

