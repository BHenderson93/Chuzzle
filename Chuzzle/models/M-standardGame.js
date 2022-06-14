const mongoose = require('./M-connection')
const { Schema, model } = mongoose

const gameSchema = new Schema ({
    fen:{type:String , required:true , default:"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"},
    userWhite: {type: Schema.Types.ObjectId , required:true},
    userBlack:{type: Schema.Types.ObjectId , required:true},
    currentPosition: {type:String , required:true},
    currentTurn:{type:Number , default:0 , required:true},
    comments:[{type:Schema.Types.ObjectId}],
    active:{type:Boolean , default:true}
})

module.exports = model('StandardGames' , gameSchema)