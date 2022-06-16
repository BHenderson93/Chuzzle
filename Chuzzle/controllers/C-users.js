const express = require('express')
const router = express.Router()
const User = require('../models/M-user')
const Tactics = require('../models/M-tactic')
const Comments = require('../models/M-comment')
const apiTactic = require('../models/M-apiTactic')
const bcrypt = require('bcryptjs')


router.get('/', (req, res) => {
    res.redirect('/users/login')
})

router.get('/login', (req, res) => {
    res.render('users/login')
})

router.get('/signup', (req, res) => {
    res.render('users/signup', {
    })
})

router.get('/profile', (req, res) => {
    if (!req.session.loggedIn) {
        res.redirect('/users/login')
    }
    res.redirect(`/users/profile/${req.session.name}`)
})

router.get('/profile/:username', (req, res) => {
    if (!req.session.loggedIn) {
        res.redirect('/users/login')
    }
    console.log('checking for name ' ,req.session.name)
    User.findOne({ name: req.session.name }).then((user) => {
        console.log('Found user' , user.name , 'Moving on to tactics')
        Tactics.find({createdById:user._id}).then((tactList)=>{
            Comments.find({user:user._id}).then((comList)=>{
                res.render('users/profile', {
                    user,
                    tactList,
                    comList,
                    name:req.session.name
                })
            })
        })
    })
})

router.post("/signup", async (req, res) => {
    console.log('making new user', req.body)
    req.body.password = await bcrypt.hash(req.body.password, await bcrypt.genSalt(10))
    let newUser = { name: req.body.username, password: req.body.password }
    User.create(newUser).then((user) => {
        console.log(`Made a new user! ${req.body.username}`)
        res.redirect('/users/login')
    }).catch((err) => {
        //console.log(err)
        console.log('Username taken')
        res.redirect('/users/signup')
    })
});

router.post("/login", async (req, res) => {
    const { name, password } = req.body
    console.log('login name is ' , req.body.name)
    User.findOne({ name }).then(async (user) => {
        if (user) {
            console.log('found the user')
            const userIdString=user._id.toString()
            const result = await bcrypt.compare(password, user.password)
            if (result) {
                req.session.name = name
                req.session.userId = userIdString
                req.session.loggedIn = true
                res.redirect('/game/tactic/api')
            } else {
                console.log('Trouble matching PW')
                res.redirect('/users/login');
            }
        } else {
            console.log('Can not find user.')
            res.redirect('/users/login');
        }
    })
        .catch((error) => {
            console.log(error);
            res.json({ error });
        });
});

router.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        res.redirect("/");
    });
});


router.delete('/profile/:username/:id' , (req,res)=>{
    console.log('hit delete route')
    Comments.deleteOne({_id:req.params.id}).then((del)=>{
        console.log('Comment deleted' , del)
        User.updateOne({_id:req.body.user} , {$pull:{commentsCreatedList:req.params.id}}).then((com)=>{
            console.log('user updated', com)
            Tactics.updateOne({_id:req.body.location} , {$pull:{comments:req.params.location}}).then((validation)=>{
                if (validation.matchedCount === 0){
                    console.log('Could not find in tactics, must be api?')
                    apiTactic.updateOne({_id:req.body.location} , {$pull:{comments:req.params.location}}).then((validation2)=>{
                        console.log('api updated attempt ',validation2)
                    })
                }
            })
        })
    }).catch((err)=>{
        console.log('there was an error in deleting comment' ,err)
    }).finally(()=>{
        res.redirect(`/users/profile/${req.params.username}`)
    })
})





module.exports = router