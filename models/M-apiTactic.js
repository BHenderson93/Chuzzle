const mongoose = require('./M-connection')
const { Schema, model } = mongoose

const apiTacticSchema = new Schema({
    fen: { type: String, required: true },
    moves: [{ type: String , required:true}],
    puzzleid:{type:String , default:'API Generated', required:true},
    createdBy:{type:String , default:'API'},
    difficulty:{type:Number , default: 1500},
    comments: [{ type:Schema.Types.ObjectId, default:''}],
    totalAttempts: { type: Number , default:0},
    successes: { type: Number , default:0},
    fails: { type: Number,default:0}
})

module.exports = model('apiTactics', apiTacticSchema)