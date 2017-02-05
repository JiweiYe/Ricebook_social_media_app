import React from 'react'
import TestUtils from 'react-addons-test-utils'
import {findDOMNode} from 'react-dom'
import {shallow} from 'enzyme'
import { expect } from 'chai'
import mockery from 'mockery'
import fetch, { mock } from 'mock-fetch'

import Action from '../../actions'
import {ArticlesView} from './articlesView'
import {NewArticle} from './newArticle' 

import Reducer from '../../reducers'
import {articles} from '../../reducers'

let initialState = {
    common:{error:'', success: '',location: ''},
    articles:{articles:{},searchKeyword:'', avatars: {} },
    profile: { username: '',headline: '',avatar: '',email: '',zipcode: '',dob: ''},
    followers:{ followers: {}}
}


describe('ArticlesView (component tests)', ()=>{

    let articles = {
    	1:{id:1,author:'stephen', text:'An article'}, 
    	2:{id:2,author:'User1', text:'Another article'}
    }

    let addArticle = {id:3,author:'User2', text:'third article'}

    let addArticles = {...articles, 3: addArticle}

    it('should dispatch actions to create a new article',()=> {
        expect(Reducer(
        	Reducer(undefined, {type:'UPDATE_ARTICLES', articles}), {type:'ADD_ARTICLE',article: addArticle}))
       .to.eql({...initialState, articles: {...initialState.articles, articles:addArticles }})
    })
})