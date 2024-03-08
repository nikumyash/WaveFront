const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const userSchema = mongoose.Schema({
        email: {
            type: String,
            required: true,
            lowercase: true,
            unique: true
        },
        name:{
            type:String,
            required:true,
        },
        hash:{
            type:String,
            required:true,
        },
        username: {
            type: String,
            required:true,
            unique: true,
        },
        bio: {
            type: String,
            maxlength: [160, 'Bio should not be more than 160'],
            default: "",
        },
        profileImg: {
            type: String,
            default:""
        },
        followedTopics:{
            type:[Schema.Types.ObjectId],
            ref:"topics"
        },
        totalFollowers:{
            type:Number,
            default:0,
        },
        blogs: {
            type: [ Schema.Types.ObjectId ],
            ref: 'blogs',
            default: [],
        }
}, 
{ 
    timestamps: {
        createdAt: 'joinedAt'
    } 

})
userSchema.index({name:'text',username:'text',bio:'text'});


module.exports = mongoose.model("users", userSchema);
