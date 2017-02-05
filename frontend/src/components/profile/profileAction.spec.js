import { expect } from 'chai'
import mockery from 'mockery'
import fetch, { mock } from 'mock-fetch'



let resource, url, profileActions

describe('Validate Profile actions', () => {


	beforeEach(() => {
  		if (mockery.enable) {
			mockery.enable({warnOnUnregistered: false, useCleanCache:true})
			mockery.registerMock('node-fetch', fetch)
			require('node-fetch')
			url = require('../../actions').apiUrl
            resource = require('../../actions').resource
            profileActions = require('./profileActions')
  		}
	})

	afterEach(() => {
  		if (mockery.enable) {
			mockery.deregisterMock('node-fetch')
			mockery.disable()
	  	}
	})
  it('should fetch the user profile information', (done) => {
  
      const avatar = 'self.img'
      const zipcode = '77030'
      const email = 'a@b.com'
      const dob = 'Thu Oct 15 1992'


      mock(`${url}/avatars`, {
        method: 'GET',
        headers: {'Content-Type':'application/json'},
        json: { avatars : [{avatar}] }
      })

      mock(`${url}/zipcode`, {
        method: 'GET',
        headers: {'Content-Type':'application/json'},
        json: { zipcode }
      })  
      
      mock(`${url}/email`, {
        method: 'GET',
        headers: {'Content-Type':'application/json'},
        json: { email }
      })

      mock(`${url}/dob`, {
          method: 'GET',
          headers: {'Content-Type': 'application/json'},
          json: {dob}
      })

      
      var tmp = 0;
      profileActions.fetchProfile()(
        fn => fn(action => {
          if (tmp == 0){
              expect(action).to.eql({
                  avatar:avatar, type:'UPDATE_PROFILE'
              })
              tmp++                 
          }else if (tmp == 1){
              expect(action).to.eql({
                  zipcode, type:'UPDATE_PROFILE'
              })
              tmp++
          }else if (tmp == 2){
              expect(action).to.eql({
              email, type:'UPDATE_PROFILE'
              })
              tmp++
          }else if (tmp == 3){
          expect(action).to.eql({
              dob, type:'UPDATE_PROFILE'
          })
          done()  
          }  
      }))

  })

	it('should update headline', (done) => {

  		const username = 'User'
  		const headline = 'A headline'

  		mock(`${url}/headline`, {
  			method: 'PUT',
  			headers: {'Content-Type':'application/json'},
  			json: { username, headline }
  		})

  		profileActions.updateHeadline('Original Headline')(
  			fn => fn(action => {
	  		expect(action).to.eql({ 
	  			headline, type:'UPDATE_PROFILE'
	  		})
	  		done()
  		}))

	})

})
