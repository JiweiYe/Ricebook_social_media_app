import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { uploadImage } from './profileActions'

class Avatar extends Component {

    componentDidUpdate(oldprops) {
        if (oldprops.img != this.props.img) {
            this.preview = undefined
            this.file = undefined
            this.forceUpdate()
        }
    }

    handleImageChange(e) {
        e.preventDefault()

        let reader = new FileReader();
        reader.onloadend = () => {
            this.preview = reader.result
            this.forceUpdate();
        }

        this.file = e.target.files[0];
        reader.readAsDataURL(this.file)
    }

    render() { return (
            <div>
                <center>
                <img width="100%" src={this.props.img}/>
                <h3> Update Your Avatar </h3>
                <input type="file" id="profileImageId" accept="image/*" onChange={(e) => this.handleImageChange(e)}/>
                { !this.file ? '' :
                <div>
                    <div>
                        { this.file.webkitRelativePath || this.file.name } 
                    </div>
                    <button value="Upload" onClick={() => { 
                        document.getElementById('profileImageId').value = null
                        this.props.dispatch(uploadImage(this.file)) 
                    }}>Update Avatar</button>
                </div>
            }
                </center>
            </div>

    )}
}

export default connect(
    (state) => {
        return {
            img: state.profile.avatar
        }
    }
)(Avatar)
