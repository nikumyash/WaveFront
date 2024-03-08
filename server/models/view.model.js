const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const viewSchema = mongoose.Schema({
    blogId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'blogs'
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'users',
        default:null,
    },
},
{
    timestamps: {
        createdAt: 'viewedAt'
    }
})

module.exports= mongoose.model("views", viewSchema)