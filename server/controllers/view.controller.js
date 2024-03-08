const { nanoid } = require("nanoid");
const redis = require("./../config/redisconfig");
const View = require("./../models/view.model");
const Blog = require("./../models/blog.model");

const addView = async(req,res)=>{
    let {uuid} = req?.cookies;
    const {blogId} = req.query;
    try{
        const curBlog = await Blog.findOne({blogId:blogId});
        if(!curBlog)return res.status(400).json({error:"Blog not found"});
        if(!uuid){
            uuid = nanoid(64);    
            let checkuuid = await redis.get("user:"+uuid);
            while(checkuuid){
                console.log(checkuuid);
                uuid = nanoid(64)
                checkuuid = await redis.get("user:"+uuid);
            };
            checkuuid = await redis.set("user:"+uuid,1,"EX",6*60*60);
            res.cookie("uuid",uuid,{
            maxAge: 6*60*60*1000,
            httpOnly: true,
            }
        )}
        else {
            let checkuuid = await redis.get("user:"+uuid);
            if(!checkuuid)return res.status(400).json({error:"Invalid uuid"});
        }
        const checkView = await redis.get(blogId+":"+uuid);
        if(checkView)return res.status(200).json({status:"Ok"});
        await redis.set(blogId+":"+uuid,1,"EX",6*60*60);
        const newView = View({blogId:curBlog._id,user:req.user._id});
        await newView.save();
        res.status(200).json({status:"Ok"});
        await Blog.findOneAndUpdate({_id:curBlog._id},{"$inc":{'metadata.totalViews':1}});
    }catch(e){  
        console.log(e);
        return res.status(500).json({error:"Something went wrong"});
    }

}

module.exports = {addView};