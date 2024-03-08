const jwt = require('jsonwebtoken');

const generateAccessToken = (user)=>{
    const token =  jwt.sign(user,process.env.ACCESS_SECRET,{
        expiresIn:"1h"
    })
    return token;
}
const generateRefreshToken = (user,res)=>{
    const token =  jwt.sign(user,process.env.REFRESH_SECRET,{
        expiresIn:"7d"
    })
    res.cookie("refreshToken",token,{
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
    });
}
const generateMailToken = (email,hash)=>{
    return jwt.sign({email:email},hash,{
        expiresIn:"1d"
    })
}
const generateChangeEmailToken = (oldEmail,newEmail,hash)=>{
    return jwt.sign({oldEmail:oldEmail,newEmail:newEmail},hash,{
        expiresIn:"1d"
    })
}
module.exports = {generateAccessToken,generateRefreshToken,generateMailToken,generateChangeEmailToken};