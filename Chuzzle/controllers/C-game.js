const express = require('express')
const router = express.Router()
const Tactic = require('../models/M-tactic')


router.get('/standard-game', (req, res) => {
    const generalFEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"
    const testFEN = "2r2rk1/3nqp1p/p3p1p1/np1p4/3P4/P1NBP3/1PQ2PPP/2R2RK1"
    res.render('chess/standardGame')
})

router.get('/tactic/user', (req, res) => {
    Tactic.findOne({}).then((tactic) => {
        console.log(tactic)
        let solutionArr = []
        for (let move of tactic.moves) {
            let specificSq = ''
            for (let char of move) {
                switch (char) {
                    case 'a':
                        specificSq += 0
                        break
                    case 'b':
                        specificSq += 1
                        break
                    case 'c':
                        specificSq += 2
                        break
                    case 'd':
                        specificSq += 3
                        break
                    case 'e':
                        specificSq += 4
                        break
                    case 'f':
                        specificSq += 5
                        break
                    case 'g':
                        specificSq += 6
                        break
                    case 'h':
                        specificSq += 7
                        break
                    case '1':
                        specificSq += 7
                        break
                    case '2':
                        specificSq += 6
                        break
                    case '3':
                        specificSq += 5
                        break
                    case '4':
                        specificSq += 4
                        break
                    case '5':
                        specificSq += 3
                        break
                    case '6':
                        specificSq += 2
                        break
                    case '7':
                        specificSq += 1
                        break
                    case '8':
                        specificSq += 0
                        break


                }
            }
            solutionArr.push(specificSq)
        }
        console.log(solutionArr)
        res.render('chess/tactic', {
            fen: `${tactic.fen}`,
            moves: `${solutionArr}`,
            id: `${tactic.puzzleid}`
        })
    }).catch((err) => {
        console.log(err)
    })
})

router.get('/create' , (req,res)=>{
    res.render('chess/create')
})

module.exports = router