const mongoose = require('./M-connection')
const { Schema, model } = mongoose


const commentSchema = new Schema ({
    body:{type:String , required:true},
    user:{type:String , required:true},
    username:{type:String , required:true},
    location:{type:String , required:true}
},{
    timestamps:true
})

module.exports = model('Comments' , commentSchema)