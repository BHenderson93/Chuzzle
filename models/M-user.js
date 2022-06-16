const mongoose = require('./M-connection')
const { Schema, model } = mongoose

const userSchema = new Schema ({
    name:{type:String , required: true , unique:true},
    password:{type:String, required:true},
    tacticRating:{type:Number , default:0},
    standardGameList: [ {type:String, ref:'Games' , default:null} ],
    tacticsCreatedList: [ {type:String , ref:'Created Tactic', default:null}],
    commentsCreatedList: [ {type: String , ref:'Comments' , default:null}],
    rank: Number
},
{
    timestamps:true
})

module.exports = model('Users' , userSchema)