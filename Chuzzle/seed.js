const mongoose = require('./models/M-connection')
const User = require('./models/M-user')
const Tactics = require('./models/M-tactic')
const Standard = require('./models/M-standardGame')
const Comment = require('./models/M-comment')

const starterUsers = [{
    name: 'Bryce',
    password: '123',
}, {
    name: 'Jordan',
    password: '123'
}
]

const starterTactics = [{
    fen:'2r2rk1/3nqp1p/p3p1p1/np1p4/3P4/P1NBP3/1PQ2PPP/2R2RK1',
    moves:["c3d5","e6d5","c2c8","f8c8"],
}
]

Tactics.deleteMany({}).then(() => {
    Tactics.create(starterTactics).then((tactics)=>{
        console.log('Reseeded tactics' , tactics)
    })
}).catch((err) => {
    console.log('Error: ', err)
}).finally(() => {

})

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
        mongoose.connection.close()
    })
}).catch((err) => {
    console.log('Error: ', err)
}).finally(() => {
    
})