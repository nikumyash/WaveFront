const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const blogSchema = mongoose.Schema({
    blogId: {
        type: String,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
    },
    previewImg: {
        type: String,
    },
    subtitle: {
        type: String,
        maxlength: 200,
    },
    content: {
        type: Object,
    },
    topics: {
        type: [String],
    },
    author: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    metadata: {
        totalLikes: {
            type: Number,
            default: 0
        },
        totalComments: {
            type: Number,
            default: 0
        },
        totalViews: {
            type: Number,
            default: 0
        },
    },
    comments: {
        type: [Schema.Types.ObjectId],
        ref: 'comments'
    },
}, 
{ 
    timestamps: {
        createdAt: 'publishedAt'
    } 
})
blogSchema.index({title:'text',subtitle:'text'});

module.exports= mongoose.model("blogs", blogSchema);