const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const topicSchema = mongoose.Schema({
    name:{
        type:String,
        unique:true,
        required:true,
    },
    totalBlogs:{
        type:Number,
        default:0,
    }
}, 
{ 
    timestamps: {
        createdAt: 'publishedAt'
    } 

})
topicSchema.index({name:'text'});
module.exports= mongoose.model("topics", topicSchema);