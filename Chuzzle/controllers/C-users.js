const express = require('express')
const router = express.Router()
const User = require('../models/M-user')


router.get('/' , (req,res)=>{
    res.redirect('/users/login')
})

router.get('/login' , (req,res)=>{
    res.render('users/login')
})

router.get('/signup' , (req,res)=>{
    res.render('users/signup' , {

    })
})

router.get('/profile' , (req,res)=>{
    User.findOne({name:'Bryce'}).then((user)=>{
        res.render('users/profile' , {
            user
        })
    })

})



module.exports = router