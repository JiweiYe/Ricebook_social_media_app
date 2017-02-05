import { expect } from 'chai'
import { go, sleep, findId, findCSS, By, driver } from './selenium'

describe('End-to-End Test: Profile Page', () => {

    before('should update email and verify', (done) => {
    	driver.executeScript("arguments[0].click();", findId('btn_toprofile'))
    	.then(done)
    })

    it('should update the email and verify', (done) =>{
    	var newemail = 'agoraphobia@rice.edu'
    	sleep(200)
    	.then(findId('email').sendKeys(newemail))
        .then(sleep(300))
    	.then(findId('btn_updateprofile').click())
        .then(sleep(300))
    	.then(findId('email').getAttribute('placeholder')
    		.then(text => {
    			expect(text).to.equal(newemail)
    		})
    	.then(done))
    })

    it('should update the zipcode and verify', (done) =>{
    	var newzipcode = '99999'
    	sleep(200)
    	.then(findId('zipcode').sendKeys(newzipcode))
        .then(sleep(300))
    	.then(findId('btn_updateprofile').click())
        .then(sleep(300))
    	.then(findId('zipcode').getAttribute('placeholder')
    		.then(text => {
    			expect(text).to.equal(newzipcode)
    		})
    	.then(done))
    })

    it('should update the password and verify a "will not change" '+
    	'message is returned', (done) =>{
    	var password = 'qwerty'
    	var passwordcof = 'qwerty'
    	sleep(200)
    	.then(findId('password').sendKeys(password))
    	.then(findId('pwconf').sendKeys(passwordcof))
        .then(sleep(300))
    	.then(findId('btn_updateprofile').click())
        .then(sleep(500))
    	.then(findId('errorMessage').getText()
    		.then(text => {
    			expect(text).to.equal('password will not be changed')
    		})
    	.then(done))
    })
})