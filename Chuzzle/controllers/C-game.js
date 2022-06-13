const express = require('express')
const router = express.Router()




router.get('/standard-game' , (req,res)=>{
    res.render('chess/standardGame', {

    })
})

module.exports = router