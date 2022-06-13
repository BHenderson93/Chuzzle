const mongoose = require('./M-connection')
const { Schema, model } = mongoose


const userSchema = new Schema ({
    commentText:{type:String , required:true},
    user:{type:Schema.Types.ObjectId , required:true},
    location:{type:Schema.Types.ObjectId , required:true}
},{
    timestamps:true
})

module.exports = model('Comments' , userSchema)