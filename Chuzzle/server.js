//Variable initialization
const express = require('express')
const path = require('path')
const app = require('liquid-express-views')(express(), { root: [path.resolve(__dirname, 'views/')] })
const session = require('express-session')
const Mongo = require('connect-mongo')

const userRouter = require('./controllers/C-users')
const gameRouter = require('./controllers/C-game')
//middleware
app.use(express.static('public'));

//Routers
app.use('/users' , userRouter)
app.use('/game' , gameRouter)

//Basic Routes

//could make this a homepage
app.get('/' , (req,res)=>{
    res.redirect('/users/login')
})

app.get('/board' , (req,res)=>{
    res.render('chess/standardGame' , {

    })
})

app.get('/seed' , (req,res)=>{
    
})

//Server

app.listen(3000 , ()=>{
    console.log('Server on')
})