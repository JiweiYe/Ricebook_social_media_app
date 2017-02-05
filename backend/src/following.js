const User = require('./model.js').User
const Profile = require('./model.js').Profile

const putFollowing = (req, res) =>{
    var tofollow = req.params.user
    var user = req.username
    if (!req.params.user) {
        res.status(400).send('missing the input of person to follow')
        return
    }
    //check whether user is in the database
    //if yes, check whether the user is already followed
    //if no, follow the user and add to the database
    else{
        User.find({username:tofollow}).exec(function(err, users){
            if(err)
                return console.log(err)
            else if(!users  || users.length === 0){
                res.status(400).send('can not find the user in the database')
                return
            }
            else{
                Profile.find({username:user}).exec(function(err, profiles){
                    var followList = profiles[0].following
                    var alreadyfollow = followList.filter((r)=>{return r == tofollow})
                    if(!alreadyfollow  || alreadyfollow.length === 0){
                        Profile.update({username:user}, {$addToSet:{following:tofollow}}, {new:true}, function(err){
                            if(err)
                                return console.log(err)
                            else{
                                var newlist
                                Profile.find({username:user}).exec(function(err, profiles){
                                    newlist = profiles[0].following
                                    res.status(200).send({
                                        username:user,
                                        following:newlist
                                    })
                                })
                            }
                        })
                    }
                    else{
                        res.status(400).send('you have already follow this user')
                        return
                    }
                })
            }
        })
    }
}

const getFollowing = (req, res) =>{
    var user = req.params.user ? req.params.user : req.username
    Profile.find({username:user}).exec(function(err,profiles){
        if(err)
            return console.log(err)
        else{
            if(!profiles || profiles.length === 0){
                res.status(400).send("this user has not registered")
                return
            }
            else{
                res.status(200).send({
                    username:user,
                    following:profiles[0].following
                })
            }
        }
    })
}

const deleteFollowing = (req, res)=>{
    var user = req.username
    var follower = req.params.user
    if(!follower){
        res.status(400).send("missing the following user")
        return
    }
    //{$pull:{following:follower}} will delete only follower in mongodb
    Profile.update({username:user}, {$pull:{following:follower}}, {new:true}, function(err){
            Profile.find({username:user}).exec(function(err, profiles){
            res.status(200).send({
                username:user,
                following:profiles[0].following
            })
        })
    })
}

module.exports = (app) => {
    app.delete('/following/:user', deleteFollowing)
    app.put('/following/:user', putFollowing)
    app.get('/following/:user?',getFollowing)  
}