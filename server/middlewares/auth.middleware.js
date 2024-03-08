const User = require('../models/user.model');
const jwt = require("jsonwebtoken");

const checkUser = async (req,res,next)=>{
    try{
        const token = req.headers["x-a-t"];
        if(token || token?.startsWith("Bearer ")){
            const accessToken = token.split(' ')[1];
            const decoded = jwt.decode(accessToken);
            const user = await User.findOne({email:decoded.email});
            req.user = user;
        };
        next();
    }
    catch(e){
        console.log(e);
        next();
    }
}

const isAuthenticated = async (req,res,next)=>{
    try{
        const token = req.headers["x-a-t"];
        if(!token || !token?.startsWith("Bearer ")){
            return res.status(401).json({errors:"Unauthorized"});
        };
        const accessToken = token.split(' ')[1]
        const decoded = jwt.verify(accessToken,process.env.ACCESS_SECRET,async (err,decoded)=>{
            if(err)
            {
                console.log(err)
                return res.status(401).json({errors:"Unauthorized"})
            };
            const user = await User.findOne({email:decoded.email});
            req.user = user;
            next(); 
        });
    }catch(e){
        console.log("Error in auth : ",e.message);
        res.status(401).json({errors:"Unauthorized"});
    }
}

module.exports = {isAuthenticated,checkUser};