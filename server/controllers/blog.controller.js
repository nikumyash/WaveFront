const {validationResult} =require("express-validator");
const Blog = require("../models/blog.model");
const { nanoid } = require("nanoid");
const Topic = require("../models/topic.model");
const User = require("../models/user.model");
const Like = require("../models/like.model");
const View = require("./../models/view.model");

const createBlog = async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {     
        return res.status(400).json({ error: errors.array().map(x=>x.msg) });   
    }
    const {title,subtitle,content,previewImage,topics} = req.body;
    try{
        const userid = req?.user?._id.toString();
        let blogUrl = nanoid(32);
        while(true){
            let checkBlog = await Blog.findOne({blogId:blogUrl});
            if(!checkBlog)break;
            else blogUrl = nanoid(32);
        }
        const blog = Blog({title:title,subtitle:subtitle,content:content,author:userid,topics:topics,previewImg:previewImage,blogId:blogUrl})
        await blog.save();
        res.status(200).json({
            url:blogUrl
        })
    }catch(e){
        console.log(e);
        return res.status(500).json({error:"Something went wrong"});
    }
    try{
        await Promise.all(topics.map(async (topic)=>{
            const curTopic = await Topic.findOne({name:topic});
            if(curTopic){
                curTopic.totalBlogs += 1;
                await curTopic.save(); 
            }
            else{
                const newTopic = Topic({name:topic,totalBlogs:1});
                await newTopic.save();
            }
        }));
    }catch(e){
        console.log(e);
    }
}

const searchBlogs = async (req,res)=>{
    const {q,topic,sort,offset,limit} =  req.query;
    try{
        if(topic){
            await Blog.find({topics:{"$in":topic}})
            .populate("author","name username profileImg  -_id")
            .sort({"metadata.totalViews":sort||-1,"publishedAt":sort || -1})
            .select("blogId title publishedAt previewImg subtitle topics -_id")
            .skip(offset||0)
            .limit(limit||8)
            .then(blogs=>{
                return res.status(200).json({blogs})
            })
        }
        else if(q){
            await Blog.find({"$text":{"$search":decodeURIComponent(q),"$caseSensitive" :false}})
            .populate("author","name username profileImg  -_id")
            .select("blogId title publishedAt previewImg subtitle topics -_id")
            .sort({"metadata.totalViews":sort||-1,"publishedAt":sort || -1})
            .skip(offset||0)
            .limit(limit||8)
            .then(blogs=>{
                return res.status(200).json({blogs})
            })
        }
        else{
            await Blog.find()
            .populate("author","name username profileImg  -_id")
            .sort({"publishedAt":sort || -1})
            .select("blogId title publishedAt previewImg subtitle topics -_id")
            .skip(offset||0)
            .limit(limit||8)
            .then(blogs=>{
                return res.status(200).json({blogs})
            })
        }
    }catch(e){
        console.log(e);
        return res.status(500).json({error:"Something went wrong"});
    }
}

const searchBlogsbyUser = async(req,res)=>{
    try{
        const {user} = req.params;
        const {offset,limit} =  req.query;
        const author = await User.findOne({username:user});
        if(author){
            await Blog.find({author:author._id})
            .populate("author","name username profileImg  -_id")
            .select("blogId title publishedAt previewImg subtitle topics -_id")
            .sort({"metadata.totalViews":-1,"publishedAt":-1})
            .skip(offset||0)
            .limit(limit||8)
            .then(blogs=>{
                return res.status(200).json({blogs})
            })
        }else{
            return res.status(400).json({error:"User not found"});
        }
    }catch(e){
        console.log(e);
        return res.status(500).json({error:"Something went wrong"});
    }
}

const getBlog = async(req,res)=>{
    const {slug} = req.params;
    try{
        const blog = await Blog.findOne({blogId:slug})
        .populate("author","name profileImg username -_id")
        .select("blogId title subtitle previewImg content topics metadata.totalLikes metadata.totalComments publishedAt");
        if(!blog)return res.status(400).json({error:"Blog not found"});
        const isLikedBy = await Like.findOne({blogId:blog?._id,likedBy:req?.user?._id});
        return res.status(200).json({blog:{
            blogId:blog.blogId,
            title:blog.title,
            subtitle:blog.subtitle,
            content:blog.content,
            previewImg:blog.previewImg,
            topics:blog.topics,
            author:blog.author,
            metadata:{
                totalLikes:blog.metadata.totalLikes,
                totalComments:blog.metadata.totalComments
            },
            publishedAt:blog.publishedAt


        },isEditable:blog?.author.username==req?.user?.username,isLiked:isLikedBy?true:false});
    }catch(e){
        console.log(e);
        return res.status(500).json({error:"Something went wrong"});
    }
}

const editBlog =  async(req,res)=>{
    const errors = validationResult(req);
    const {blogSlug} = req.params;
    if (!errors.isEmpty()) {     
        return res.status(400).json({ error: errors.array().map(x=>x.msg) });   
    }
    const {title,subtitle,content,previewImage,topics} = req.body;
    try{
        const userid = req?.user?._id.toString();
        const _blog = await Blog.findOne({blogId:blogSlug,author:userid});
        if(!_blog)return res.status(400).json({error:"Cannot find Blog"});
        const blog = await Blog.findOneAndUpdate({blogId:blogSlug},{title:title,subtitle:subtitle,content:content,topics:topics,previewImg:previewImage})
        res.status(200).json({
            url:blogSlug
        })
        await Promise.all(blog.topics.map(async (topic)=>{
            const curTopic = await Topic.findOne({name:topic});
            if(curTopic){
                curTopic.totalBlogs -= 1;
                await curTopic.save(); 
            }
        }));
    }catch(e){
        console.log(e);
        return res.status(500).json({error:"Something went wrong"});
    }
    try{
        await Promise.all(topics.map(async (topic)=>{
            const curTopic = await Topic.findOne({name:topic});
            if(curTopic){
                curTopic.totalBlogs += 1;
                await curTopic.save(); 
            }
            else{
                const newTopic = Topic({name:topic,totalBlogs:1});
                await newTopic.save();
            }
        }));
    }catch(e){
        console.log(e);
    }
}

const getSuggestedBlog = async(req,res)=>{
    const {slug} = req.params;
    try{
        const curBlog = await Blog.findOne({blogId:slug}).populate("author","username profileImg name bio");
        if(!curBlog)return res.status(400).json({error:"Blog does not exists"});
        const author = curBlog.author;
        const sugBlogs = await Blog.find({author:author._id,blogId:{"$ne":slug}}).sort({"publishedAt":-1}).limit(4)
        .select("blogId title subtitle previewImg metadata.totalLikes metadata.totalComments publishedAt -_id");
        return res.status(200).json({blogs:sugBlogs,author:{username:author.username,name:author.name,profileImg:author.profileImg,bio:author.bio}});
    }catch(e){
        console.log(e);
        return res.status(500).json({error:"Something went wrong"});
    }
}

const likeBlog = async(req,res)=>{
    const {blog} = req.params;
    try{
        const user = req.user;
        const curBlog = await Blog.findOne({blogId:blog});
        if(!curBlog)return res.status(400).json({error:"No such Blog Found"});
        const isLiked = await Like.findOne({blogId:curBlog._id,likedBy:user._id});
        if(isLiked)return res.status(400).json({error:"Blog is already Liked."});
        const like = Like({blogId:curBlog._id,likedBy:user._id});
        let result = await like.save();
        curBlog.metadata.totalLikes +=1;
        await curBlog.save(); 
        return res.status(200).json({status:"OK"})
    }
    catch(e){
        console.log(e);
        return res.status(500).json({error:"Something went wrong"});
    }
}

const unlikeBlog = async(req,res)=>{
    const {blog} = req.params;
    try{
        const user = req.user;
        const curBlog = await Blog.findOne({blogId:blog});
        if(!curBlog)return res.status(400).json({error:"No such Blog Found"});
        const isLiked = await Like.findOne({blogId:curBlog._id,likedBy:user._id});
        if(!isLiked)return res.status(400).json({error:"Blog is not Liked."});
        const unlike = await Like.deleteOne({blogId:curBlog._id,likedBy:user._id});
        curBlog.metadata.totalLikes -=1;
        await curBlog.save(); 
        return res.status(200).json({status:"OK"})
    }
    catch(e){
        console.log(e);
        return res.status(500).json({error:"Something went wrong"});
    }
}

const deleteBlog = async(req,res)=>{
    const {slug} = req.params;
    try{
        const curBlog = await Blog.findOne({blogId:slug}).populate("author");
        if(!curBlog)return res.status(400).json({error:"No blog found"});
        if(curBlog.author._id.toString()!=req.user._id.toString())return res.status(400).json({error:"Cannot delete other's blog."});
        await Blog.deleteOne({blogId:slug});
        res.status(200).json({status:"ok"});
        await Promise.all(curBlog.topics.map(async (topic)=>{
            const curTopic = await Topic.findOne({name:topic});
            if(curTopic){
                curTopic.totalBlogs -= 1;
                await curTopic.save(); 
            }
        }));
        await Like.deleteMany({blogId:curBlog._id});
        await View.deleteMany({blogId:curBlog._id});
    }catch(e){
        console.log(e);
        return res.status(500).json({error:"Something went wrong"});
    }
}


const getPopularBlog = async(req,res)=>{
    const {offset,limit} =  req.query;
    try{
        await Blog.find()
        .populate("author","name username profileImg  -_id")
        .select("blogId title publishedAt previewImg subtitle topics -_id")
        .sort({"metadata.totalViews":-1,"publishedAt": -1})
        .skip(offset||0)
        .limit(limit||8)
        .then(blogs=>{
            return res.status(200).json({blogs})
        })
    }catch(e){
        console.log(e);
        return res.status(500).json({error:"Something went wrong"});
    }
}

const recentlyViewed = async(req,res)=>{
    try{
        const recentlyViewed = await View.find({user:req.user._id})
        .sort({"viewedAt":-1}).limit(4).populate({
            path : 'blogId',
            select:'-_id title publishedAt blogId',
            populate : {
              path : 'author',
              select:'name username profileImg -_id',
            }
        }).select('blogId -_id');
        const result = recentlyViewed.map((blog)=>blog.blogId);
        return res.status(200).json({blogs:result});

    }catch(e){
        console.log(e);
        return res.status(500).json({error:"Something went wrong"});
    }
}
module.exports = {createBlog,searchBlogs,deleteBlog,searchBlogsbyUser,editBlog,recentlyViewed,getBlog,likeBlog,unlikeBlog,getPopularBlog,getSuggestedBlog};