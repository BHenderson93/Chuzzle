const mongoose = require('./models/M-connection')
const User = require('./models/M-user')
const Tactics = require('./models/M-tactic')
const Standard = require('./models/M-standardGame')
const Comment = require('./models/M-comment')
const apiTactics = require('./models/M-apiTactic')

const starterUsers = [{
    name: 'Bryce',
    password: '123',
}, {
    name: 'Jordan',
    password: '123'
}
]

const starterTactics = [{
    fen:'2r2rk1/3nqp1p/p3p1p1/np1p4/3P4/P1NBP3/1PQ2PPP/2R2RK1 w',
    moves:["c3d5","e6d5","c2c8","f8c8"],
},{
    fen: 'BQQBQQQQ/RRRRQQQK/NNQBQRNR/NQQBQNQB/BNNPnRBR/QQNNPPPQ/1RQPQQQQ/kBQQQQQQ w',
    moves: [ 'c3a2', 'e4g5' ],
    puzzleid: 'User Created',
    createdBy: 'Bruce',
},{
    fen: 'rnbqk1nr/pppp1ppp/8/2b1p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR b',
    moves: [ 'a7a6', 'h5f7' ],
    puzzleid: 'User Created',
    createdBy: 'Bruce',
},{
    fen:'1KR1Q2R/PPn1PPBP/5NP1/8/5q2/2n2pb1/ppp3pp/1kr2b1r w',
    moves: ['f6h5', 'c7a6', 'b8a8', 'f4b8', 'c8b8', 'a6c7'],
    puzzleid:'SmotheredM8',
    createdBy:'Mr.Bruce'
},{
    fen: '6r1/1k6/p1p1b3/1p2B3/1P3P2/P5Kp/8/7R w',
    moves: ['g3h2' , 'g8g2'],
    puzzleid: 'Rookm8',
    createdBy:'Mr.Bruce'
}
]
//API section
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'ce47f640e6msh4de3cba4491ad13p164bbejsna395f7724c5c',
		'X-RapidAPI-Host': 'chess-puzzles.p.rapidapi.com'
	}
};

fetch('https://chess-puzzles.p.rapidapi.com/?rating=1500&themesType=ALL&count=250', options)
	.then(response => response.json())
	.then(response => {
        apiTactics.deleteMany({}).then(() => {
            let apiTL = []
            for (let puzzle of response.puzzles){
                apiTL.push({
                    fen: puzzle.fen,
                    moves: puzzle.moves,
                    puzzleid: puzzle.puzzleid,
                    difficulty:puzzle.difficulty,
                })
            }
            apiTactics.create(apiTL).then((tactics)=>{
                console.log('Reseeded tactics' , tactics)
            })
        }).catch((err) => {
            console.log('Error: ', err)
        }).finally(() => {
        
        })
    
    })
	.catch(err => console.error(err));

//end API section

Comment.deleteMany({}).then(() => {
    console.log('Reseeded comments')
}).catch((err) => {
    console.log('Error: ', err)
}).finally(() => {

})

Standard.deleteMany({}).then(() => {
    console.log('Reseeded games')
}).catch((err) => {
    console.log('Error: ', err)
}).finally(() => {

})

User.deleteMany({}).then(() => {
    User.create(starterUsers).then((users)=>{
        console.log('Reseeded users' , users)
    }).catch((err)=>{
        console.log(err)
    }).finally(()=>{
        console.log('Reseed complete.')

    })
}).catch((err) => {
    console.log('Error: ', err)
}).finally(() => {
    
})