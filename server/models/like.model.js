const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const likeSchema = mongoose.Schema({
    blogId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'blogs'
    },
    likedBy: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'users',
    },
},
{
    timestamps: {
        createdAt: 'likedAt'
    }
})

module.exports= mongoose.model("likes", likeSchema)