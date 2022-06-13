const mongoose = require('./M-connection')
const { Schema, model } = mongoose

const userSchema = new Schema ({
    name:{type:String , require: true , unique:true},
    password:{type:String, required:true},
    tacticRating:{type:Number , default:0},
    standardGameList: [ {type:Schema.Types.ObjectId, ref:'Games' , default:null} ],
    tacticsCreatedList: [ {type:Schema.Types.ObjectId , ref:'Created Tactic', default:null}],
    commentsCreatedList: [ {type: Schema.Types.ObjectId , ref:'Comments' , default:null}],
    rank: Number
},
{
    timestamps:true
})

module.exports = model('Users' , userSchema)