const express = require('express')
const router = express.Router()



router.get('/standard-game' , (req,res)=>{
    const generalFEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"
    const testFEN = "2r2rk1/3nqp1p/p3p1p1/np1p4/3P4/P1NBP3/1PQ2PPP/2R2RK1"
    res.render('chess/standardGame', {
        gamePackage:gamePackage,
        generalFEN:generalFEN

    })
})

router.get('/tactic' , (req,res)=>{
    res.render('chess/tactic')
})

module.exports = router