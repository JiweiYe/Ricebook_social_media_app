'use strict'
// this is model.js 
var mongoose = require('mongoose')
require('./db.js')

var commentSchema = new mongoose.Schema({
	commentId: String, 
	author: String, 
	text: String,
	date: Date,
	avatar: String
})

var articleSchema = new mongoose.Schema({
	id: Number, 
	author: String, 
	text: String,
	date: Date, 
	img: String, 
	comments: [ commentSchema ]
})

var userSchema = new mongoose.Schema({
	authorization:[],
	authId:String,
	username: String,
    salt: String,
    hash: String
})

var profileSchema = new mongoose.Schema({
	username: String,
    headline: String,
    following: [ String ],
    dob: Number,
    email: String,
    zipcode: String,
    avatar: String  
})

exports.Article = mongoose.model('articles', articleSchema)
exports.User = mongoose.model('users', userSchema)
exports.Profile = mongoose.model('profiles', profileSchema)
exports.Comment = mongoose.model('comments', commentSchema)
