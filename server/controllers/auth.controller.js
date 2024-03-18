const { validationResult } = require("express-validator");
const User = require('../models/user.model');
const { nanoid } = require("nanoid");
const { generateAccessToken, generateMailToken, generateRefreshToken } = require("../util/generateJWT");
const { sendLoginMail, transporter, sendSignupMail } = require("../services/mail.service");
const jwt = require('jsonwebtoken');
const {getAuth} = require("firebase-admin/auth");

const userLogin = async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {     
        return res.status(400).json({ error: errors.array().map(x=>x.msg) });   
    }
    try{
        const {email} = req.body
        const checkUser = await User.findOne({email:email});
        if(!checkUser)return res.status(403).json({error:"User not found"});
        res.status(200).json({msg:"Ok"});
        const hash = checkUser.hash;
        const mailToken = generateMailToken(email,hash);
        sendLoginMail(transporter,email,mailToken);
    }
    catch(e){
        console.log(e);
        return res.status(500).json({error:"Something went wrong"});
    }
}

const userSignup = async (req,res)=>{
    const errors = validationResult(req);
    console.log(req.body)
    if (!errors.isEmpty()) {     
        return res.status(403).json({ error: errors.array().map(x=>x.msg) });   
    }
    try{
        const {name,email} = req.body;
        const checkEmail = await User.findOne({email:email});
        if(checkEmail){
            return res.status(403).json({error:"User Already Exists"})
        }
        const hash = nanoid(32);
        const newUser = User({name:name,email:email,hash:hash});
        const nameFromEmail = email.split("@")[0];
        let username = nameFromEmail;
        while(true){
            let checkUsername = await User.findOne({username:username});
            if(!checkUsername)break;
            else username = nameFromEmail +"-"+ nanoid(8);
        }
        newUser.username = username;
        const gg = await newUser.save();
        res.status(200).json({msg:"Ok"});
        const mailToken = generateMailToken(email,hash);
        sendSignupMail(transporter,email,mailToken);
    }
    catch(e){
        console.log(e);
        return res.status(500).json({error:"Something went wrong"});
    }
}

const checkAuthLink = async(req,res)=>{
    const {token} = req.query;  
    if(!token){
        return res.send(403).json({errors:"No Token Provided"});
    }
    const decodedToken = jwt.decode(token);
    const user = await User.findOne({email:decodedToken.email}).populate("followedTopics","name -_id");
    if(!user)return res.status(403).json({errors:"User not found"});
    try{
        jwt.verify(token,user.hash,(err,decodedUser)=>{
            if(err)return res.status(403).json({errors:"Invalid token"});
            else if(decodedUser){
                const accessToken = generateAccessToken({email:decodedToken.email});
                generateRefreshToken({email:decodedToken.email},res);
                const email = user.email;
                const name = user.name;
                const username = user.username;
                const profilePic = user.profileImg;
                const bio = user.bio;
                const followedTopics = user.followedTopics
                res.status(200).json({
                    accessToken,
                    email,
                    username,
                    name,
                    bio,
                    profilePic,
                    followedTopics,
                });
            }
        });
        const newHash = nanoid(32);
        user.hash = newHash;
        await user.save();
    }catch(e){
        console.log(e);
        return res.status(500).json({error:"Something went wrong"});
    }
} 

const tokenRefresh = async(req,res)=>{
    const {refreshToken} = req?.cookies;
    try{
        console.log("refreshToken");
        if(!refreshToken)return res.status(401).json({errors:"No token provided."});
        jwt.verify(refreshToken,process.env.REFRESH_SECRET,async (err,decoded)=>{
            if(err) return res.status(401).json({errors:"Invalid token"});
            else if(decoded){
                const user = await User.findOne({email:decoded.email});
                if(!user)return res.status(401).json({errors:"Invalid token"});
                const accessToken = generateAccessToken({email:decoded.email});
                generateRefreshToken({email:decoded.email},res);
                return res.status(200).json({accessToken:accessToken});
            }
        });
    }
    catch(e){
        console.log(e);
        return res.status(500).json({error:"Something went wrong"});
    }
}

const userLogout = async(req,res)=>{
    res.clearCookie("refreshToken",{httpOnly:true,sameSite:"None",secure:true});
    res.json({msg:"Ok"});
}

const authWithGoogle = async(req,res)=>{
    const {accessToken} = req.body;
    try{
        getAuth()
        .verifyIdToken(accessToken)
        .then(async(user)=>{
            console.log(user);
            const {email,picture,name} = user;
            const curUser = await User.findOne({email:email});        
            const newHash = nanoid(32);
            if(curUser){
                curUser.profileImg  = picture || curUser.profileImg;
                curUser.displayName = name || curUser.displayName;
                const accessToken = generateAccessToken({email:email});
                generateRefreshToken({email:email},res);
                const _email = curUser.email;
                const _name = curUser.name;
                const username = curUser.username;
                const profilePic = curUser.profileImg;
                const bio = curUser.bio;
                const followedTopics = curUser.followedTopics
                res.status(200).json({
                    accessToken,
                    email:_email,
                    username,
                    name:_name,
                    bio,
                    profilePic,
                    followedTopics,
                });
                await curUser.save();
                return;
            }
            else{
                // here was the error
                const nameFromEmail = email.split("@")[0];
                let tempUsername = nameFromEmail;
                while(true){
                    let checkUsername = await User.findOne({username:tempUsername});
                    if(!checkUsername)break;
                    else tempUsername = nameFromEmail +"-"+ nanoid(8);
                }
                const newUser = User({name:name,email:email,profileImg:picture,username:tempUsername,hash:newHash});
                await newUser.save();
                const accessToken = generateAccessToken({email:email});
                generateRefreshToken({email:email},res);
                const _email = newUser.email;
                const _name = newUser.name;
                const username = newUser.username;
                const profilePic = newUser.profileImg;
                const bio = newUser.bio;
                const followedTopics = newUser.followedTopics
                return res.status(200).json({
                    accessToken,
                    email:_email,
                    username,
                    name:_name,
                    bio,
                    profilePic,
                    followedTopics,
                });
            }            
        })
    }catch(e){
        console.log(e);
        return res.status(500).json({error:"Something went wrong"});
    }
}

module.exports = {userLogin,userSignup,checkAuthLink,tokenRefresh,userLogout,authWithGoogle};