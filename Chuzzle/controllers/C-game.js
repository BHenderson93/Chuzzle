const express = require('express')
const router = express.Router()
const Tactic = require('../models/M-tactic')
const apiTactic = require('../models/M-apiTactic')

const tacticMoveConverter = (tacticJSON) => {
    let solutionArr = []
    for (let move of tacticJSON.moves) {
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
    return solutionArr
}

router.get('/standard-game', (req, res) => {
    const generalFEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"
    const testFEN = "2r2rk1/3nqp1p/p3p1p1/np1p4/3P4/P1NBP3/1PQ2PPP/2R2RK1"
    res.render('chess/standardGame')
})

router.get('/tactic/user', (req, res) => {
    Tactic.findOne({}).then((tactic) => {
        console.log(tactic)
        let moves = tacticMoveConverter(tactic)
        res.render('chess/tactic', {
            fen: `${tactic.fen}`,
            moves: `${moves}`,
            id: `${tactic.puzzleid}`,
            currMove:`0`
        })
    }).catch((err) => {
        console.log(err)
    })
})

router.get('/tactic/api', (req, res) => {
    //pick a random one
    apiTactic.count().exec(function (err, count) {
        let random = Math.floor(Math.random() * count)
        apiTactic.findOne().skip(random)
            .then((tactic) => {
                console.log(tactic)
                let currMove = tactic.fen.split(' ')[1] === 'w' ? 0 : 1
                let moves = tacticMoveConverter(tactic)
                res.render('chess/tactic', {
                    fen: `${tactic.fen}`,
                    moves: `${moves}`,
                    id: `${tactic.puzzleid}`,
                    currMove: `${currMove}`
                })
            })
    })
})

router.get('/create', (req, res) => {
    res.render('chess/create')
})

module.exports = router