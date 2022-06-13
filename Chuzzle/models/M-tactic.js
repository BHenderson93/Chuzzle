const mongoose = require('./M-connection')
const { Schema, model } = mongoose

const tacticSchema = new Schema({
    fen: { type: String, required: true },
    solutionSequence: { type: String , required:true},
    createdBy: { type: Schema.Types.ObjectId },
    comments: { type: Schema.Types.ObjectId },
    totalAttempts: { type: Number },
    successes: { type: Number },
    fails: { type: Number }
})

module.exports = model('Tactics', tacticSchema)