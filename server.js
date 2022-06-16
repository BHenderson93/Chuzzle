//Variable initialization
const express = require('express')
const path = require('path')
const app = require('liquid-express-views')(express(), { root: [path.resolve(__dirname, 'views/')] })
const session = require('express-session')
const Mongo = require('connect-mongo')
const mongoose = require('./models/M-connection')
const methodOverride = require('method-override')

const userRouter = require('./controllers/C-users')
const gameRouter = require('./controllers/C-game')
//middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true })) //for req.body contents to be passed on
app.use(methodOverride("_method"))
app.use(session({
    saveUnitialized:true,
    reSave:false,
}))

//Routers
app.use('/users' , userRouter)
app.use('/game' , gameRouter)

//Basic Routes

//could make this a homepage
app.get('/' , (req,res)=>{
    res.redirect('/users/login')
})
//Server

app.listen(process.env.PORT || 3000 , ()=>{
    console.log('Server on')
})