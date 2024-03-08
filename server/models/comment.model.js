const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const commentSchema = mongoose.Schema({
    blogId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'blogs'
    },
    commentId:{
        type:String,
        unique:true,
        required:true,
    },
    isAuthor:{
        type:Boolean,
        default:false,
    },
    content: {
        type: String,
        required: true
    },
    commentPath: {
        type: [String],
        default:[]
    },
    isReplied:{
        type:Boolean,
        default:false,
    },
    commentedBy: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: 'users'
    },
    parentComment: {
        type: String,
        default:null,
    }
},
{
    timestamps: {
        createdAt: 'commentedAt'
    }
})

module.exports= mongoose.model("comments", commentSchema)