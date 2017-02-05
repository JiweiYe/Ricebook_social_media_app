import { expect } from 'chai'
import { go, sleep, findId, findCSS, By, findClassName, findElementsName } from './selenium'

describe('End-to-End Test: Main Page', () => {

	it('should create new article and the article appears in feed', (done) => {
		var newarticle = 'this is my new article'
		sleep(200)
		.then(findId('textplace').clear())
		.then(findId('textplace').sendKeys(newarticle))
		.then(sleep(200))
		.then(findId('btn_addArticle').click())
		.then(sleep(200))
		.then(findClassName('userfeed').getText() 
			.then( text => {
				expect(text).to.equal(newarticle)
			})
			.then(done))
	})

	it('should edit an article and validate the article text has updated',(done) => {
		var article
		var appendString = "what a wonderful world"
		sleep(200)
		.then(findClassName('userfeed').getText()
			.then (text => {
				article = text + appendString
				sleep(500)
				findClassName('userfeed').clear()
				sleep(500)
				findClassName('userfeed').sendKeys(article)
				sleep(500)
				findClassName('btn_editpost').click()			
				findClassName('userfeed').getText()
					.then(text => {
						expect(text).to.equal(article)
					})
			})
			.then(done))
	})

	it('should update headline and verify change',(done) => {
		var newheadline = 'this is my new headline'
		sleep(200)
		.then(findId('new_headline').sendKeys(newheadline))
		.then(findId('btn_updateheadline').click())
		.then(findId('main_headline').getText()
			.then(text => {
				expect(text).to.equal(newheadline)
			})
			.then(done))
	})
	
	it('should count the number of followed users',(done) => {
		sleep(200)
		.then(findElementsName('[name = "follower"]')
			.then(elements =>{
				expect(elements.length).to.be.at.least(3)
			}))
		.then(done)
	})

	it('should add the "Follower" user and verify following count increases by one',(done) => {
		var count
		sleep(200)
		.then(findElementsName('[name = "follower"]')
			.then(elements => {
				count = elements.length
				findId('text_follower').sendKeys('jr58')
				findId('btn_addfollower').click()
				sleep(300)
				findElementsName('[name = "follower"]')
				.then(elements => {
					expect(count).to.equal(elements.length-1)
				})
			})
			.then(done))	
	})

 	it('should Remove the Follower user and verify following count decreases by one',(done) => {
		var count
		sleep(200)
		.then(findElementsName('[name = "follower"]')
			.then(elements => {
				count = elements.length
				findClassName('btn_unfollow').click()
				sleep(300)
				findElementsName('[name = "follower"]')
				.then(elements => {
					expect(count).to.equal(elements.length+1)
				})
			})
			.then(done))	
	})

	it('should search for "Only One Article Like This" and' +
		'verify only one article shows, and verify the author',(done) => {
		var searchString = "Only One Article Like This"
		sleep(200)
		.then(findId('searchbox').sendKeys(searchString))
		.then(findId('btn_search').click())
		.then(sleep(300))
        .then(findClassName('articleUserName').getText()
            .then(author => {
                expect(author).eql('jy54test')
            }))
        .then(findElementsName('[name = "userarticle"]')
        	.then(elements => {
        		expect(elements.length).to.equal(1)
        	})
        .then(done))

	})

})