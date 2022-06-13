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

}]

Tactics.deleteMany({}).then(() => {
    console.log('Reseeded tactics')
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