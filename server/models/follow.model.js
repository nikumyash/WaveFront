const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const followSchema = mongoose.Schema({
    follower: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    following: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'users',
    },
},
{
    timestamps: {
        createdAt: 'followedAt'
    }
})

module.exports= mongoose.model("follows", followSchema)