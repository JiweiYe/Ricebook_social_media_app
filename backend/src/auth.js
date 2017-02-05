const md5 = require('md5')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const request = require('request')
const session = require('express-session')
const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy;
const redis = require('redis').createClient('redis://h:p4sf0tv5ldvdj3a12gv16ud10oj@ec2-54-221-228-237.compute-1.amazonaws.com:12399')
var users = [];
const User = require('./model.js').User
const Profile = require('./model.js').Profile
const callbackURL = 'https://mighty-reef-86521.herokuapp.com/auth/callback'
const config = {
	clientID:'325893917793968', 
	clientSecret:'35f25c9c89b0a9d5e0076523e667ef4c', 
	callbackURL:callbackURL,
	passReqToCallback: true
}
const Article = require('./model.js').Article
const Comment = require('./model.js').Comment
let hostUrl = ''
var cookieKey = 'sid'
var mySecretMessage = "you can never guess what it is"

//function to create salt 
function createSalt () {
	var library = "ashgacqqgueuiqibyseuvsukszfwuf71y2dyvgi3t8t8f";
	var saltLength = 10;
	var index = Math.floor(Math.random()*(library.length-saltLength))
	var salt = library.substring(index,index+10);
	return md5(salt + new Date().getTime()) ;
}

function register(req, res){
	var username = req.body.username;
	var email = req.body.email;
	var dob = new Date(req.body.birth).getTime();
	var zipcode = req.body.zipcode; 
	var password = req.body.password;
	var headline = "A default headline"
	if(!username || !password || !dob || !zipcode || !password){
		res.status(400).send("all fields should be filled in")
		return
	}
	else{
	//find whether the user already exist
	//if not, register this user
	User.find({username:username}).exec(function(err, users){
		if(err)
			return console.log(err)
		else{
			if(users.length !== 0){
				res.status(400).send("this username has already been used")
				return
			}
			else{
				var salt = createSalt();
				var hash = md5(password+salt)
				var obj_user = new User({username:username, salt:salt, hash:hash})
				new User(obj_user).save(function (err, user){
					if(err) 
						return console.log(err)
				})
				var obj_profile = new Profile({username:username, email:email, 
					following:[], dob:dob, headline:'default headline', zipcode:zipcode,
					avatar:'http://cistercianinformer.com/wp-content/uploads/2016/01/rice-logo.png',
					headline: headline})
				new Profile(obj_profile).save(function (err, user){
					if(err)
						return console.log(err)
					})
				res.status(200).send({result:'success', username:username})
			}
		}
	})
	}
}

function login(req, res){
	var username = req.body.username;
	var password = req.body.password;
	if(!username || !password){
		res.status(400).send("missing password or username")
		return
	}
	//check whether this user has registered or not
	//if already registered and the password is correct, login user
	User.find({username: username}).exec(function(err, users){
		if(err)
			return console.log(err)
		else{
		    if (!users  || users.length === 0){
		        res.status(401).send("this username hasn't been registered")
		        return
		    }
		    obj_user = users[0]
			if(!obj_user){
				res.status(401).send("Don't have this user")
				return
			}
			var sid = md5(mySecretMessage + new Date().getTime() + obj_user.username)
			if(md5(password+obj_user.salt) == obj_user.hash){
				redis.hmset(sid, obj_user)
				res.cookie(cookieKey, sid,{maxAge: 3600*1000, httpOnly: true})
				var msg = {username:username, result: 'success'}
				res.status(200).send(msg)
			}
			else {
				res.status(401).send("incorrect password")
			}
		}
	})
}

//use Facebook Strategy to login

// passport.serializeUser(function(user, done){
// 	users[user.id] = user
// 	done(null, user.id)
// })

// passport.deserializeUser(function(id,done){
// 	var user = users[id]
// 	done(null,user)
// })

// passport.use(new FacebookStrategy(config,
// 	function(token, refreshToken, profile, done){
// 		process.nextTick(function(){
// 			return done(null,profile);
// 		})
// 	}
// ))

passport.serializeUser(function(user, done){
	done(null, user.id)
})

passport.deserializeUser(function(id,done){
	User.findOne({authId: id}).exec(function(err, user) {
		done(null, user)
	})
})

passport.use(new FacebookStrategy(config,
	function(req, token, refreshToken, profile, done){
		const username = profile.displayName + "@" + profile.provider
		//check if there is a login user
		const sid = req.cookies[cookieKey]

		if(!sid){
			User.findOne({username: username}).exec(function(err, user) {
				if(!user || user.length === 0){
					const Obj_user = new User({username: username, authId: profile.id})
					new User(Obj_user).save(function (err, usr){
						if(err) return console.log(err)
					})
					const Obj_profile = new Profile({
						username: username, 
						headline: "login from facebook account", 
						following:[], 
						email: null, 
						zipcode: null, 
						dob: new Date(1993,11,02).getTime(), 
						avatar: "http://www.cfz.org.uk/images/facebook.png"})
					new Profile(Obj_profile).save(function (err, usr){
						if(err) return console.log(err)
					})
				}
				return done(null, profile)
			})
		} 

		else {
			//link the accounts if a normal account is already logged in
			redis.hgetall(sid, function(err, Obj_user) {
				const localUser = Obj_user.username
				Profile.findOne({username: username}).exec(function(err, profileData){
					if(profileData){
						const old_followers = profileData.following
						Profile.findOne({username: localUser}).exec(function(err, newProfile) {
							if(newProfile){
								//merge the follower
								const newfollowers3 = newProfile.following.concat(old_followers)
								Profile.update({username: localUser}, {$set: {'following': newfollowers3}}, function(){})
							}
						})
						//clear the data in the facebook account
						Profile.update({username: username}, {$set: {'following':[]}}, function(){})
					}
				})
				Article.update({author:username}, { $set: { 'author': localUser}}, { new: true, multi: true }, function(){})
				Article.update({'comments.author' : username}, { $set: {'comments.$.author': localUser}}, { new: true, multi: true }, function(){})
				User.findOne({username: localUser}).exec(function(err, user){
					if(user){
						let authObj = {}
						authObj[`${profile.provider}`] = profile.displayName
						User.update({username: localUser}, {$addToSet: {'authorization': authObj}}, {new: true}, function(){})
					}
				})
			})
			return done(null, profile)
		}
	}
))


function isLoggedIn(req, res, next){
	if (req.isAuthenticated()) {
		const usrArr = req.user.username.split('@');
		const authObj = {}
		authObj[`${usrArr[1]}`] = usrArr[0]
		User.findOne({authorization: authObj}).exec(function(err,user) {
			if(!user){
				req.username = req.user.username
			} else {
				req.username = user.username
			}
			next()
		})
	} 
	else {
	var sid = req.cookies[cookieKey]
	if (!sid){
        return res.sendStatus(401)
    }
    redis.hgetall(sid, function(err, Obj_user) {
    	if(err) throw err;
    	if(Obj_user){
    		console.log(sid + 'mapped to ' + Obj_user.username)
    		req.username = Obj_user.username
			next()
		}
		else{
			res.sendStatus(401)
		}
    })
}
}

function profile(req,res){
	res.send({'ok now what?':req.user})
}

function putPassword(req,res){
	var password = req.body.password
	var username = req.username
	if(!password){
		res.status(400).send('missing password')
		return
	}
	//check whether the password is the same or not
	//if is not the same, change the password
	else {
		User.find({username:username}).exec(function(err,user){
			if(err)
				return console.log(err)
			else{
				var obj_user = user[0];
				if(md5(obj_user.salt+password) === obj_user.hash){
					res.status(400).send("new password is the same as old password")
					return
				}
				else{ 
					var newsalt = createSalt();
					var newhash = md5(password+newsalt);
					User.update({username: username}, { $set: { salt: newsalt, hash: newhash }}, { new: true }, function(err, user){
		        		res.sendStatus(200)
		    		})
				}	
			}
		})
	}

}

function logout(req,res) {
	if (req.isAuthenticated()) {
		req.session.destroy()
		req.logout()
		res.status(200).send("OK")
	} 
	else{
	//clear log in information
	//clear session id
	redis.del(req.cookies[cookieKey])
	res.clearCookie(cookieKey)
	res.status(200).send("OK")	
}
}

const FB_connect = (req, res) => {
	const username = req.body.originalUserName;
	const password = req.body.originalPassword;
	if (!username || !password) {
		res.status(400).send("Missing Username or Password")
		return
	}
	User.find({username: username}).exec(function(err, users){
        if (!users || users.length === 0){
            res.sendStatus(400)
            return
        }
        const Obj_user = users[0]
		if(!Obj_user){
			res.status(400).send("This user has not registered")
		}
		const salt = Obj_user.salt;
		const hash = Obj_user.hash;

		if(md5(password + salt) === hash){
			//third party username
			console.log("i am now here")
			Article.update({author:req.username}, { $set: { 'author': username}}, { new: true, multi: true}, function(){})
			Article.update({'comments.author' : req.username}, { $set: {'comments.$.author': username}}, { new: true, multi: true }, function(){})
			Profile.findOne({username: req.username}).exec(function(err, profile){
				if(profile){
					const old_followers = profile.following
					Profile.findOne({username: username}).exec(function(err, newProfile) {
						if(newProfile){
							const newfollowers3 = newProfile.following.concat(old_followers)
							Profile.update({username: username}, {$set: {'following': newfollowers3}}, function(){})
						}
					})
					//delete the profile record
					Profile.update({username: req.username}, {$set: {
						'headline': "Login from facebook account", 
						'following':[], 
						'email': null, 
						'zipcode': null, 
						'dob': new Date(1993,11,02).getTime(), 
						'avatar': "http://www.cfz.org.uk/images/facebook.png"}}, function(){})
				}
			})
			User.findOne({username: username}).exec(function(err, user){
				if(user){
					const usrArr = req.username.split('@');
					const authObj = {}
					authObj[`${usrArr[1]}`] = usrArr[0]
					User.update({username: username}, {$addToSet: {'authorization': authObj}}, {new: true}, function(){})
				}
			})
			res.status(200).send({ username: username, result: 'success'})
		} else{
			res.status(401).send("incorrect password!")
		}
	})
}

const FB_disconnect = (req, res) => {
	const username = req.username
	User.findOne({username: username}).exec(function(err, user){
		if(user.authorization.length !== 0){
			User.update({username: username}, {$set: {authorization: []}}, {new: true}, function(){
				res.status(200).send({result: 'successfully unlink'})
			})
		} else {
			res.status(400).send("no link account")
		}
	})
}

const success_res = (req,res) => {
	res.redirect(hostUrl)
}

const error_res = (err,req,res,next) => {
    if(err) {
        res.status(400);
        res.send({err: err.message});
    }
}

const location_res = (req, res, next) => {
	if(hostUrl === ''){
		hostUrl = req.headers.referer
	}
	next()
}


module.exports = app => {
	app.use(location_res)
	app.use(session({secret:'ccfdtdctfkdctd4e56si6drfnd56sftysd5dx', resave: false, saveUninitialized: false}))
	app.use(passport.initialize())
	app.use(passport.session())
	app.use('/login/facebook', passport.authenticate('facebook', {scope:'email'}))
	app.use('/auth/callback', passport.authenticate('facebook', {failureRedirect:'/fail'}), success_res, error_res)
	
	app.use(cookieParser())
	app.post('/register', register)
	app.post('/login', login)


	app.use(isLoggedIn)
	app.use('/link/facebook', passport.authorize('facebook', {scope:'email'}))
	app.get('/FB_disconnect', FB_disconnect)
	app.post('/FB_connect', FB_connect)
	app.put('/password', putPassword)
	app.put('/logout', logout)
	app.use('/profile', profile)

	}
