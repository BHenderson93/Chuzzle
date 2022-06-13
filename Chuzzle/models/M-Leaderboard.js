const mongoose = require('./M-connection')
const { Schema, model } = mongoose


const rankSchema = new Schema ({
    rank
})

module.exports = model('Rankings' , userSchema)