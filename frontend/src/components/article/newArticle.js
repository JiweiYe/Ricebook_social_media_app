import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { uploadArticle } from './articleActions'

class NewArticle extends Component {

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
            <br/>
            <textarea id = "textplace" class="newPostBody"
              cols="80" rows="10" placeholder="Add a new article"
              value={ this.message }
              onChange={(e) => {
                this.message = e.target.value
                this.forceUpdate();
            }}>
            </textarea>


            <div >
                Add a picture
                <input type="file" id="articleImage" accept="image/*" onChange={(e) => this.handleImageChange(e)}/>
            </div>

            { !this.file && !this.message ? '' :
                <div>
                <button id = 'btn_addArticle'
                    onClick={() => {
                            this.props.dispatch(uploadArticle(this.message, this.file))
                            this.message = ''
                            this.file = undefined
                            document.getElementById('articleImage').value = null;
                            this.forceUpdate()
                        }}>Post</button>
                <button onClick = {() => {textplace.value = ''}}>Clear</button>
                </div>
            }

        { !this.file ? '' :
            <div className="row">
                <img className="postImage" src={this.preview}/>
                <div>
                { this.file.webkitRelativePath || this.file.name }<br/>
                ({ parseInt(this.file.size / 1024 * 100)/100.0 } kB)
                </div>
            </div>
        }
        </div>
    )}
}

export default connect()(NewArticle)

