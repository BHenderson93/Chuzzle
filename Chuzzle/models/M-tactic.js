const mongoose = require('./M-connection')
const { Schema, model } = mongoose

const tacticSchema = new Schema({
    fen: { type: String, required: true },
    moves: [{ type: String , required:true}],
    puzzleid:{type:String , default:'User Created'},
    createdBy: String,
    comments: [{ type: Schema.Types.ObjectId }],
    totalAttempts: { type: Number , default:0},
    successes: { type: Number , default:0},
    fails: { type: Number,default:0}
})

module.exports = model('Tactics', tacticSchema)