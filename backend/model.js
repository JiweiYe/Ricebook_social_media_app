'use strict'
// this is model.js 
var mongoose = require('mongoose')
require('./db.js')

var commentSchema = new mongoose.Schema({
	commentId: Number, 
	author: String, 
	date: Date, 
	text: String
})

var articleSchema = new mongoose.Schema({
	id: Number, 
	author: String, 
	img: String, 
	date: Date, 
	text: String,
	comments: [ commentSchema ]
})

var userSchema = new mongoose.Schema({
	username: String,
    salt: String,
    hash: String
})

var profileSchema = new mongoose.Schema({
	username: String,
    headline: String,
    following: [ String ],
    dob: Date,
    email: String,
    zipcode: String,
    avadar: String  
})

exports.Article = mongoose.model('articles', articleSchema)
exports.User = mongoose.model('users', userSchema)
exports.Profile = mongoose.model('profiles', profileSchema)
exports.Comment = mongoose.model('comments', profileSchema)
