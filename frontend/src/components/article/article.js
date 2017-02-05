import moment from 'moment'
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import Comment from './comment'
import ContentEditable from './contentEditable'
import { editArticle } from './articleActions'

class Article extends Component {

  constructor(props) {
    super(props)
    this.hideComments = true
    this.disabled = true
    this.addComment = false
    this.newComment = ''
  }

  render() {
    const date = moment(new Date(this.props.date))
    return (
      <div className = "card" name = "userarticle">
          <img id ="cardUserImage" src={ this.props.avatar }/><br/>
          <h3><em className = "articleUserName">{this.props.author}</em> said on {date.format('MM-DD-YYYY')} at {date.format('HH:mm:ss')}</h3>
          
          <div>
              <ContentEditable
              className = "userfeed" 
              html={this.props.text}
              contentEditable={this.props.username == this.props.author}
              tooltip={this.props.username == this.props.author ? 'click to change article' : ''}
              onChange={(e) => {
                this.newMessage = e.target.value
                this.disabled = this.props.text == this.newMessage
                this.forceUpdate()
              }}/>
              <center>
              <img id="postImage" src={this.props.img}/>
              </center>
          </div>


          <div>
            <button onClick={() => {
                this.hideComments = !this.hideComments
                this.forceUpdate()
              }}>
              { this.hideComments ? 'Show' : 'Hide' } Comments ({ this.props.comments.length })
            </button>

            <button onClick={() => { this.addComment = !this.addComment; this.forceUpdate() }}>
              { this.addComment ? 'Cancel' : 'Add Comment' }
            </button>

            { this.props.author != this.props.username ? '' :
            <button title="Click Text to Change Article"
              className = "btn_editpost"
              disabled={this.disabled}
              onClick={() => {
                this.props.dispatch(editArticle(this.props._id, this.newMessage))
                this.disabled = true
                this.forceUpdate()
              }}>
              Edit post
            </button>
            }
          </div>

        <div>
        { !this.addComment ? '' :
          <div>
            <div>
              <textarea cols="100" rows="5" placeholder="Type in your comment"
                value={this.newComment}
                onChange={(e) => {
                  this.newComment = e.target.value
                  this.forceUpdate()
              }}>
              </textarea>
              <button disabled={ this.newComment.length == 0 }
                onClick={() => {
                  if (this.newComment.length > 0)
                    this.props.dispatch(editArticle(this.props._id, this.newComment, '-1'))
                    this.newComment = ''
                    this.addComment = false
                    this.forceUpdate()
                }}>
                Submit Comment
              </button>
            </div>
          </div>
        }
        </div>


        { this.hideComments ? '' : this.props.comments.sort((a,b) => {
          if (a.date < b.date)
            return 1
          if (a.date > b.date)
            return -1
          return 0
        }).map((comment) =>
            <Comment key={comment.commentId} articleId={this.props._id} username={this.props.username}
              commentId={comment.commentId} author={comment.author} date={comment.date}
              text={comment.text} avatar={comment.avatar} />
        )}
    </div>
  )}
}

Article.propTypes = {
  _id: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  avatar: PropTypes.string,
  date: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  img: PropTypes.string,
  comments: PropTypes.arrayOf(PropTypes.shape({
    ...Comment.propTypes
  }).isRequired).isRequired
}

export default connect()(Article)
