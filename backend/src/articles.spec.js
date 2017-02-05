const expect = require('chai').expect
const fetch = require('isomorphic-fetch')

const url = path => `http://localhost:3000${path}`

describe('Validate Article functionality', () => {
	it('should add an article, and increase the number of articles by one', (done) => {
		var num = 0 ;
		fetch(url("/articles"))
		.then(res => {
			expect(res.status).to.eql(200)	
			return res.text()
		})
		.then(body => {
			num = JSON.parse(body).articles.length
			})

		fetch(url("/article"), {
            method:'POST',
            headers:{ 'Content-Type': 'application/json' },
            body: JSON.stringify({"text":"A new article"})
        })
		.then(res => {
			expect(res.status).to.eql(200)	
			return res.json()				
		})
		.then(res => {
			expect(res.text).to.equal('A new artiacle')
		})

		fetch(url("/articles"))
		.then(res => {
			expect(res.status).to.eql(200)	
			return res.text()
		})
		.then(body => {
			expect(JSON.parse(body).articles.length).to.equal(num + 1)
		})
		.then(done)
		.catch(done)
	}, 200)


});