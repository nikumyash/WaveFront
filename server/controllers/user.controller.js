const User = require("./../models/user.model");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const {generateChangeEmailToken,generateAccessToken,generateRefreshToken} = require("./../util/generateJWT");
const { sendChangeMailMail, transporter } = require("../services/mail.service");
const {nanoid} = require("nanoid");
const Follow = require("./../models/follow.model");

const getUser = async (req,res)=>{
    const {user} = req.params;
    try{
        const _user = await User.findOne({username:user})
        if(req?.user?.username==_user.username){
            return res.status(200).json({user:{
                email:_user.email,
                name:_user.name,
                joinedAt:_user.joinedAt,
                totalFollowers:_user.totalFollowers,
                profileImg:_user.profileImg,
                bio:_user.bio,
                username:_user.username
            },isSelf:true});
        }
        if(req?.user!=null){
            const isFollowed = await Follow.findOne({follower:req.user._id,following:_user._id});
            return res.status(200).json({user:{
                email:_user.email,
                name:_user.name,
                joinedAt:_user.joinedAt,
                totalFollowers:_user.totalFollowers,
                profileImg:_user.profileImg,
                bio:_user.bio,
                username:_user.username
            },isFollowed:isFollowed?true:false});
        }   
        return res.status(200).json({user:{
            email:_user.email,
            name:_user.name,
            joinedAt:_user.joinedAt,
            totalFollowers:_user.totalFollowers,
            profileImg:_user.profileImg,
            bio:_user.bio,
            username:_user.username
        }});
    }catch(e){
        console.log(e);
        return res.status(500).json({error:"Something went wrong"});
    }
}

const generateUserEmailToken = async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {     
        return res.status(400).json({ error: errors.array().map(x=>x.msg) });   
    }
    const {email} = req.body;
    const user = req.user;
    try{
        const token = generateChangeEmailToken(user.email,email,user.hash);
        res.status(200).json({status:"Ok"});
        sendChangeMailMail(transporter,email,token);
    }catch(e){
        console.log(e);
        return res.status(500).json({error:"Something went wrong"});
    }
}

const checkMailToken = async (req,res)=>{
    const {token} = req.query;
    if(!token){
        return res.send(403).json({errors:"No Token Provided"});
    }
    const decodedToken = jwt.decode(token);
    const user = await User.findOne({email:decodedToken.oldEmail});
    const check = await User.findOne({email:decodedToken.newEmail});
    if(check)return res.status(400).json({errors:"Mail is already associated with another account."});
    if(!user)return res.status(403).json({errors:"User not found"});
    try{
        jwt.verify(token,user.hash,async (err,decodedUser)=>{
            if(err)return res.status(403).json({errors:"Invalid token"});
            else if(decodedUser){
                const newUser = await User.findOneAndUpdate({_id:user._id},{email:decodedUser.newEmail});
                if(!newUser)return res.status(400).json({error:"Something went wrong"});
                const accessToken = generateAccessToken({email:decodedToken.newEmail});
                generateRefreshToken({email:decodedToken.newEmail},res);
                const email = newEmail;
                const name = newUser.name;
                const username = newUser.username;
                const profilePic = newUser.profileImg
                const followedTopics = newUser.followedTopics
                const bio = newUser.bio;
                res.status(200).json({
                    accessToken,
                    email,
                    username,
                    bio,
                    name,
                    profilePic,
                    followedTopics,
                });
                const newHash = nanoid(32);
                newUser.hash = newHash;
                await newUser.save();
            }
        });
        
    }catch(e){
        console.log(e);
        return res.status(500).json({error:"Something went wrong"});
    } 
}
 
const changeUserProfileInfo = async(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {     
        return res.status(400).json({ error: errors.array().map(x=>x.msg) });   
    }
    const {photo,name,bio} = req.body;
    const user = req.user;
    try{
        const curUser = await User.updateOne({_id:user._id},{name:name,bio:bio,profileImg:photo});
        if(!curUser)return res.status(400).json({error:"Something went wrong"});
        return res.status(200).json({name:name,bio:bio,profileImg:photo});
    }catch(e){
        console.log(e);
        return res.status(500).json({error:"Something went wrong"});
    }
}

const changeUserName = async(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {     
        return res.status(400).json({ error: errors.array().map(x=>x.msg) });   
    }
    const {username} = req.body;
    const user = req.user;
    let tempUsername = username;
    try{
           while(true){
            let tempUser = await User.findOne({username:tempUsername});
            if(!tempUser){
                await User.updateOne({_id:user._id},{username:tempUsername});
                return res.status(200).json({username:tempUsername});
            } 
            else tempUsername = username+"-"+nanoid(8);
           }
    }catch(e){
        console.log(e);
        return res.status(500).json({error:"Something went wrong"});
    }
}

const searchUser = async(req,res)=>{
    const {q,limit,offset,sort} = req.query;
    try{
        await User.find({"$text":{"$search":decodeURIComponent(q),"$caseSensitive" :false}})
            .select("name username bio profileImg -_id")
            .skip(offset||0)
            .limit(limit||8)
            .then(users=>{
                return res.status(200).json({users})
            })
    }catch(e){
        console.log(e);
        return res.status(500).json({error:"Something went wrong"});
    }
}

const followUser = async(req,res)=>{
    const {slug} = req.params;
    try{
        const curUser = req.user;
        const userToFollow = await User.findOne({username:slug});
        if(!userToFollow)return res.status(400).json({error:"User not found"});
        const checkFollow = await Follow.findOne({follower:curUser._id,following:userToFollow._id});
        if(checkFollow)return res.status(400).json({error:"Already followed"});
        const newFollow = Follow({follower:curUser._id,following:userToFollow._id});
        await newFollow.save();
        res.status(200).json({status:"OK"});
        userToFollow.totalFollowers+=1;
        await userToFollow.save();
    }catch(e){
        console.log(e);
        return res.status(500).json({error:"Something went wrong"});
    }
}
const unFollowUser = async(req,res)=>{
    const {slug} = req.params;
    try{
        const curUser = req.user;
        const userToFollow = await User.findOne({username:slug});
        if(!userToFollow)return res.status(400).json({error:"User not found"});
        const checkFollow = await Follow.findOne({follower:curUser._id,following:userToFollow._id});
        if(!checkFollow)return res.status(400).json({error:"Not followed"});
        await Follow.deleteOne({_id:checkFollow._id});
        res.status(200).json({status:"OK"});
        userToFollow.totalFollowers-=1;
        await userToFollow.save();
    }catch(e){
        console.log(e);
        return res.status(500).json({error:"Something went wrong"});
    }
}
module.exports = {getUser,changeUserName,searchUser,followUser,unFollowUser,changeUserProfileInfo,checkMailToken,generateUserEmailToken};