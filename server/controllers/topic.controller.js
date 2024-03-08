const Topic = require("./../models/topic.model")
const User = require("./../models/user.model");


const followTopic = async(req,res)=>{
    try{
        const {slug} = req.params;
        const topic = await Topic.findOne({name:slug});
        if(!topic)return res.status(400).json({error:"Topic does not exist"});
        const uid = req?.user?._id;
        const user = await User.findOneAndUpdate({_id:uid},{$addToSet:{followedTopics:topic._id}}).populate("followedTopics","name -_id").select("followedTopics -_id");
        return res.status(200).json({status:"ok"});
    }catch(e){
        console.log(e);
        return res.status(500).json({error:"Something went wrong"});
    }
}
const unfollowTopic = async(req,res)=>{
    try{
        const {slug} = req.params;
        const topic = await Topic.findOne({name:slug});
        if(!topic)return res.status(400).json({error:"Topic does not exist"});
        const uid = req?.user?._id;
        const user = await User.findOneAndUpdate({_id:uid},{$pull:{followedTopics:topic._id}}).populate("followedTopics","name -_id").select("followedTopics -_id");
        return res.status(200).json({status:"ok"});
    }catch(e){
        console.log(e);
        return res.status(500).json({error:"Something went wrong"});
    }
}

const getTopTopics = async(req,res)=>{
    const {limit} = req.query;
    try{
        const ftopics = req?.user?.followedTopics || []
        const topics = await Topic.find({name:{"$nin":ftopics}}).sort({"totalBlogs":-1}).limit(limit||6).select("name -_id");
        return res.status(200).json({topics});
    }
    catch(e){
        console.log(e);
        return res.status(500).json({error:"Something went wrong"});   
    }
}

const getTopic= async(req,res)=>{
    const {slug} = req.params;
    try{
        let isFollowed = false;
        const topic = await Topic.findOne({name:slug});
        if(req.user){
            for(let i of req.user.followedTopics){
                if(i.toString()==topic._id.toString()){
                    isFollowed = true;
                    break;
                }
            }
        }
        return res.status(200).json({name:topic.name,totalBlogs:topic.totalBlogs,isFollowed:isFollowed});
    }catch(e){
        console.log(e);
        return res.status(500).json({error:"Something went wrong"});   
    }
}

const searchTopic = async(req,res)=>{
    const {q,limit,offset} = req.query;
    try{
        await Topic.find({"$text":{"$search":decodeURIComponent(q),"$caseSensitive" :false}})
            .select("name -_id")
            .skip(offset||0)
            .limit(limit||32)
            .then(topics=>{
                return res.status(200).json({topics})
            })
    }catch(e){
        console.log(e);
        return res.status(500).json({error:"Something went wrong"});
    }
}
module.exports = {followTopic,searchTopic,unfollowTopic,getTopTopics,getTopic}