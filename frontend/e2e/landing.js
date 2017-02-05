import { expect } from 'chai'
import { findId, sleep } from './selenium'

// TODO add your test user credentials here!
exports.registerInfo = {
    username: 'user1',
    displayname: 'stephen',
    email: 'jy54@rice.edu',
    phone: '123-123-1234',
    birth: '07/30/1994',
    zipcode: '12345',
    password: '123',
    passwordconfirmation: '123'
}

exports.creds = {
    username: 'jy54test',
    password: 'soon-early-avoid'
}

exports.login = () => 
    sleep(500)
    .then(findId('loginusername').clear())
    .then(findId('loginpassword').clear())
    .then(findId('loginusername').sendKeys(exports.creds.username))
    .then(findId('loginpassword').sendKeys(exports.creds.password))
    .then(findId('login').click())
    .then(sleep(2000))

exports.register = () => 
    sleep(500)
    .then(findId('accountName').clear())
    .then(findId('displayName').clear())
    .then(findId('emailAddress').clear())
    .then(findId('phoneNumber').clear())
    .then(findId('zipcode').clear())
    .then(findId('password').clear())
    .then(findId('passwordConfirmation').clear())
    .then(findId('accountName').sendKeys(exports.registerInfo.username))
    .then(findId('displayName').sendKeys(exports.registerInfo.displayname))
    .then(findId('emailAddress').sendKeys(exports.registerInfo.email))
    .then(findId('phoneNumber').sendKeys(exports.registerInfo.phone))
    .then(findId('idDateofBirth').sendKeys(exports.registerInfo.birth))
    .then(findId('zipcode').sendKeys(exports.registerInfo.zipcode))
    .then(findId('password').sendKeys(exports.registerInfo.password))
    .then(findId('passwordConfirmation').sendKeys(exports.registerInfo.passwordconfirmation))
    .then(findId('indexSubmit').click())
    .then(sleep(2000))

