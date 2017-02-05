const expect = require('chai').expect
const fetch = require('isomorphic-fetch')

const url = path => `http://localhost:3000${path}`

describe('Validate Profile functionality', () => {
    it('should update a headline', (done)=>{
        var newHeadline = "this is a new headline for testing"
        var oldHeadline
        fetch(url("/headlines"), {
            "method": 'GET',
            "headers": {'Content-Type': 'application/json'}
        })
        .then(res=>{
            expect(res.status).to.equal(200)
            return res.json()
        })
        .then((res)=>{ 
            oldHeadline = res.headlines[0].headline
        })  

        fetch(url("/headline"), {
            "method": 'PUT',
            "headers": {'Content-Type': 'application/json'},
            "body": JSON.stringify({"headline": newHeadline})
        })            
        .then(res=>{
            expect(res.status).to.equal(200)
            return res.json()
        })
        .then((res)=>{
            expect(res.headline).to.equal(newHeadline)
        })

        fetch(url("/headlines"), {
            "method": 'GET',
            "headers": {'Content-Type': 'application/json'}
        })
        .then(res => {
            expect(res.status).to.equal(200)
            return res.json()
        })
        .then(res => {
            expect(res.headlines).to.exist
            expect(res.headlines[0].headline).to.equal(newHeadline)
        })
        .then(done)
        .catch(done)
    }, 200)
});