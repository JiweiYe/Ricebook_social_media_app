import { expect } from 'chai'
import mockery from 'mockery'
import fetch, {mock} from 'mock-fetch'

import Reducer from './reducers'
import {articles} from './reducers'
import {filter} from './components/article/articlesView'

let initialState = {
    common:{error:'', success: '',location: ''},
    articles:{articles:{},searchKeyword:'', avatars: {} },
    profile: { username: '',headline: '',avatar: '',email: '',zipcode: '',dob: ''},
    followers:{ followers: {}}
}


describe('Validate reducer (no fetch requests here)', ()=> {
    it('should return the initial state', ()=>{
        expect(Reducer(undefined, {})).to.eql(initialState)
    })

    it('should state success (for displaying success message to user)', ()=>{
        const success = 'success'
        expect(Reducer(undefined, {type:'SUCCESS', success}))
        .to.eql({...initialState, common:{...initialState.common, success}})
    })

    it('should state error (for displaying error message to user)', ()=>{
        const error = 'error'
        expect(Reducer(undefined, {type:'ERROR', error}))
        .to.eql({...initialState, common:{...initialState.common, error}})
    })

    let articles = {1:{id:1,author:'User1', text:'A text'}, 2:{id:2,author:'User2', text:'A beautiful World'}}
    it('should set the articles',()=> {
        expect(Reducer(undefined, {type:'UPDATE_ARTICLES', articles}))
        .to.eql({...initialState, articles: {...initialState.articles, articles}})
    })

    let keyword = 'beautiful'
    it('should set the search keyword', ()=>{
        expect(Reducer(undefined, {type:'SEARCH_KEYWORD',keyword})).to.eql({...initialState, articles:{...initialState.articles, searchKeyword:keyword}})
    })

    it('should filter displayed articles by the search keyword',()=> {
        expect(filter(articles,keyword)).to.eql([{id:2,author:'User2', text:'A beautiful World'}]);
    })
})
   