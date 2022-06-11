const express = require('express')
const app = require('liquid-express-views')(express())

app.use(express.static('public'))

app.get('/board' , (req,res)=>{
    res.render('chess/V-gameboard' , {

    })
})





app.listen(3000 , ()=>{
    console.log('Server on')
})