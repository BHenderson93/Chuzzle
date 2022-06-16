const express = require('express')
const router = express.Router()
const Tactic = require('../models/M-tactic')
const apiTactic = require('../models/M-apiTactic')
const Comment = require('../models/M-comment')
const User = require('../models/M-user')

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
    if (!req.session.loggedIn) {
        res.redirect('/users/login')
    }
    const generalFEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"
    const testFEN = "2r2rk1/3nqp1p/p3p1p1/np1p4/3P4/P1NBP3/1PQ2PPP/2R2RK1"
    res.render('chess/standard')
})

router.get('/tactic/user', (req, res) => {
    if (!req.session.loggedIn) {
        res.redirect('/users/login')
    } else {
        Tactic.count().exec(function (err, count) {
            let random = Math.floor(Math.random() * count)
            Tactic.findOne({}).skip(random).then((tactic) => {
                res.redirect(`/game/tactic/user/${tactic._id}`)
            }).catch((err) => {
                console.log(err)
            })
        })
    }
})

router.get('/tactic/user/:id', (req, res) => {
    if (!req.session.loggedIn) {
        res.redirect('/users/login')
    } else {
        Tactic.findById(req.params.id).then((tactic) => {
            Comment.find({ location: tactic._id }).then((commentList) => {
                console.log(tactic)
                console.log(tactic.moves)
                let currMove = tactic.fen.split(' ')[1] === 'w' ? 0 : 1
                let moves = tacticMoveConverter(tactic)
                res.render('chess/tactic', {
                    style: '/game/tactic/user',
                    tactic: tactic,
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
    if (!req.session.loggedIn) {
        res.redirect('/users/login')
    } else {
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

router.get('/tactic/api/:id', (req, res) => {
    if (!req.session.loggedIn) {
        res.redirect('/users/login')
    } else {
        apiTactic.findById(req.params.id).then((tactic) => {
            Comment.find({location:tactic._id}).then((commentList)=>{
                console.log(tactic)
                let currMove = tactic.fen.split(' ')[1] === 'w' ? 0 : 1
                let moves = tacticMoveConverter(tactic)
                res.render('chess/tactic', {
                    style: '/game/tactic/api',
                    tactic: tactic,
                    moves: `${moves}`,
                    currMove: `${currMove}`,
                    commentList
                })
            })
        })
    }
})

router.get('/tactic/user/:id/edit', (req, res) => {
    //get route placeholder for updating tactics
    Tactic.findById(req.params.id).then((tactic)=>{
        let currMove = tactic.fen.split(' ')[1] === 'w' ? 0 : 1
        let moves = tacticMoveConverter(tactic)
        res.render('chess/editTact' , {
            tactic,
            currMove,
            moves
        })
    }).catch((err)=>{
        console.log('There was an error' , err)
    })
})

router.get('/create', (req, res) => {
    if (!req.session.loggedIn) {
        res.redirect('/users/login')
    } else {
        res.render('chess/create' , {
            fen: '8/8/8/8/8/8/8/8 w'
        })
    }
})

router.post('/create', (req, res) => {
    if (!req.session.loggedIn) {
        res.redirect('/users/login')
    } else {

        User.findById(req.session.userId).then((user) => {
            console.log('user is', user)
            let newTactic = {
                fen: req.body.fen,
                moves: req.body.moves.split(','),
                createdBy: user.name,
                createdById: user._id,
            }
            Tactic.create(newTactic).then((tact) => {
                console.log(tact)
                User.updateOne({ _id: user._id }, { $push: { tacticsCreatedList: tact._id } })
                    .then((result) => {
                        console.log(result)
                    })
            }).catch((err) => {
                console.log('error on id lookup through req.sess')
                console.log(err)
            }).finally(() => {
                res.redirect('/game/create')
            })
        })

    }
})

router.post('/tactic/user/:id', (req, res) => {
    if(!req.body.body){
        console.log('redirecting')
        res.redirect(`/game/tactic/user/${req.params.id}`)
    }else{
    let newComment = {
        body: req.body.body,
        user: req.session.userId,
        username: req.session.name,
        location: req.params.id,
    }
    Comment.create(newComment).then((comment) => {
        Tactic.updateOne({ _id: req.params.id }, { $push: { comments: comment._id } }).then(() => {
            User.updateOne({ _id: req.session.userId }, { $push: { commentsCreatedList: comment._id } }).then((result) => {
                console.log('Comment created', comment, result)
                res.redirect(`/game/tactic/user/${req.params.id}`)
            })
        })
    }).catch((err) => {
        console.log(err)
        res.redirect(`/game/tactic/user/${req.params.id}`)
    })}
})
router.post('/tactic/api/:id', (req, res) => {
    console.log('rq body is ' , req.body.body)
    if(!req.body.body){
        console.log('redirecting')
        res.redirect(`/game/tactic/api/${req.params.id}`)
    }else{
        let newComment = {
            body: req.body.body,
            user: req.session.userId,
            username: req.session.name,
            location: req.params.id,
        }
        Comment.create(newComment).then((comment) => {
            apiTactic.updateOne({ _id: req.params.id }, { $push: { comments: comment._id } }).then(() => {
                User.updateOne({ _id: req.session.userId }, { $push: { commentsCreatedList: comment._id } }).then((result) => {
                    console.log('Comment created', comment, result)
                    res.redirect(`/game/tactic/api/${req.params.id}`)
                })
            })
        }).catch((err) => {
            console.log(err)
            res.redirect(`/game/tactic/user/${req.params.id}`)
        })
    }
})

router.post('/tactic/user/:id/edit', (req, res) => {
    //get route placeholder for updating tactics
    Tactic.updateOne({_id : req.params.id} , {$set:{fen:req.body.fen , moves:req.body.moves.split(',')}}).then((result)=>{
        console.log('edit complete' , result)
        res.redirect(`/users/profile/${req.session.name}`)
    }).catch((err)=>{
        console.log(err)
    })
})

router.delete('/tactic/user/:id' , (req,res)=>{
    //delete route for tactic
    Tactic.deleteOne({_id:req.params.id}).then((del)=>{
        console.log('tactic deleted',del)
        User.updateOne({_id:req.body.createdById} , {$pull:{tacticsCreatedList: req.params.id}}).then((upd)=>{
            console.log('user updated' , upd)
            Comment.deleteMany({location:req.params.id}).then((dels)=>{
                console.log('comments deleted' , dels)
            })
        })
    }).catch((err)=>{
        console.log(err)
    }).finally(()=>{
        res.redirect(`/users/profile/${req.session.name}`)
    })
})

module.exports = router