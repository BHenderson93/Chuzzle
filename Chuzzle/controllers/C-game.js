const express = require('express')
const router = express.Router()
const Tactic = require('../models/M-tactic')
const apiTactic = require('../models/M-apiTactic')
const Comment = require('../models/M-comment')

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

router.get('/standard', (req, res) => {
    if (!req.session.loggedIn){
        res.redirect('/users/login')
    }
    const generalFEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"
    const testFEN = "2r2rk1/3nqp1p/p3p1p1/np1p4/3P4/P1NBP3/1PQ2PPP/2R2RK1"
    res.render('chess/standard')
})

router.get('/tactic/user', (req, res) => {
    if (!req.session.loggedIn){
        res.redirect('/users/login')
    }else{
        Tactic.count().exec(function(err,count){
            let random = Math.floor(Math.random()*count)
            Tactic.findOne({}).skip(random).then((tactic) => {
                res.redirect(`/game/tactic/user/${tactic._id}`)
            }).catch((err) => {
                console.log(err)
            })
        })
    }
})

router.get('/tactic/user/:id' , (req,res)=>{
    if (!req.session.loggedIn){
        res.redirect('/users/login')
    }else{
        Tactic.findById(req.params.id).then((tactic) => {
            Comment.find({location: tactic._id}).then((commentList)=>{
                console.log(tactic)
                console.log(tactic.moves)
                let currMove = tactic.fen.split(' ')[1] === 'w' ? 0 : 1
                let moves = tacticMoveConverter(tactic)
                res.render('chess/tactic', {
                    style: '/game/tactic/user',
                    tactic:tactic,
                    moves: `${moves}`,
                    currMove: `${currMove}`,
                    commentList
                })
            })

        }).catch((err) => {
            console.log(err)
        })
    }

})

router.get('/tactic/api', (req, res) => {
    if (!req.session.loggedIn){
        res.redirect('/users/login')
    }else{
        apiTactic.count().exec(function (err, count) {
            let random = Math.floor(Math.random() * count)
            apiTactic.findOne().skip(random)
                .then((tactic) => {
                    res.redirect(`/game/tactic/api/${tactic._id}`)
                    })
                })
    }
    //pick a random one

    })

router.get('/tactic/api/:id' , (req,res)=>{
    if (!req.session.loggedIn){
        res.redirect('/users/login')
    }else{
        apiTactic.findById(req.params.id).then((tactic) => {
            console.log(tactic)
            let currMove = tactic.fen.split(' ')[1] === 'w' ? 0 : 1
            let moves = tacticMoveConverter(tactic)
            res.render('chess/tactic', {
                style: '/game/tactic/api',
                tactic:tactic,
                moves: `${moves}`,
                currMove: `${currMove}`
            })
        })
    }
})

router.get('/create', (req, res) => {
    if (!req.session.loggedIn){
        res.redirect('/users/login')
    }else{
        res.render('chess/create')
    }
})


router.post('/create', (req, res) => {
    if (!req.session.loggedIn){
        res.redirect('/users/login')
    }else{
        req.body.createdBy = req.session.name
        req.body.moves = req.body.moves.split(',')
        Tactic.create(req.body).then((tact) => {
            console.log(tact)
        }).catch((err) => {
            console.log(err)
        }).finally(() => {
            res.redirect('/game/create')
        })
    }
})

router.post('/tactic/user/:id' , (req,res)=>{
    
    let newComment = {
        body: req.body.body,
        user: req.session.id,
        username: req.session.name,
        location:req.params.id,
    }
    Comment.create(newComment).then((comment)=>{
        console.log('Comment created' ,comment)
        res.redirect(`/game/tactic/user/${req.params.id}`)
    }).catch((err)=>{
        console.log(err)
        res.redirect(`/game/tactic/user/${req.params.id}`)
    })
})
module.exports = router