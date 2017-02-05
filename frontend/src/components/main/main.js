import React from 'react'

import Headline from './headline'
import Following from './following'
import ArticlesView from '../article/articlesView'

const Main = () => (
    // This is the main view.
    // On this view we display the user's avatar, their headline,
    // their feed of articles (with a search fiilter),
    // and their list of followers.
    <div>
        <div className="pagetitle">
            <center>
            <h1><strong>Main Page</strong></h1>
            </center>
        </div>
        <div id = 'leftbar'>
            <Headline/><br/><br/>
            <h2>Follower</h2>
            <Following/>
        </div>
        <div id = 'rightbar'>
            <ArticlesView/>
        </div>
    </div>
)

export default Main



/** WEBPACK FOOTER **
 ** ./src/components/main/main.js
 **/