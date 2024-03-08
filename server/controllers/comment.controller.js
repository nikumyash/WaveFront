const Comment = require("./../models/comment.model");
const Blog = require("./../models/blog.model");
const {nanoid} = require("nanoid")

const newComment = async (req,res)=>{
    const {blogId,content,parentCommentId} = req.body;
    try{
        const curUser = req.user;
        const blog = await Blog.findOne({blogId:blogId});
        if(!blog)return res.status(200).json({error:"Blog not found."});
        const isAuthor = blog.author.toString() == curUser._id.toString();
        let newCommentId;
        while(true){
            newCommentId = nanoid(32)
            const dupcomment = await Comment.findOne({commentId:newCommentId});
            if(!dupcomment)break;
        }
        if(parentCommentId){
            const parentComment = await Comment.findOne({commentId:parentCommentId});
            if(!parentComment)return res.status(200).json({error:"No parent comment found."});
            const parentPath = [...parentComment.commentPath,parentCommentId];
            const newComment = Comment({blogId:blog._id,isAuthor:isAuthor,content:content,commentId:newCommentId,commentPath:parentPath,commentedBy:curUser._id,parentComment:parentCommentId});
            const _comment = await newComment.save();
            res.status(200).json({comment:{
                commentId:_comment.commentId,
                isAuthor:_comment.isAuthor,
                content:_comment.content,
                isReplied:_comment.isReplied,
                commentedBy:{
                    name:req.user.name,
                    profileImg:req.user.profileImg,
                    username:req.user.username
                },
                commentedAt:_comment.commentedAt,
                blogId:_comment.blogId,
                isEditable:true,
            }});
            parentComment.isReplied = true;
            await parentComment.save();
            blog.metadata.totalComments +=1;
            await blog.save();
        }else{
            const newComment = Comment({blogId:blog._id,isAuthor:isAuthor,content:content,commentId:newCommentId,commentedBy:curUser._id});
            const _comment = await newComment.save();
            res.status(200).json({comment:{
                commentId:_comment.commentId,
                isAuthor:_comment.isAuthor,
                content:_comment.content,
                isReplied:_comment.isReplied,
                commentedBy:{
                    name:req.user.name,
                    profileImg:req.user.profileImg,
                    username:req.user.username
                },
                commentedAt:_comment.commentedAt,
                blogId:_comment.blogId,
                isEditable:_comment.commentedBy?.username===req?.user?.username,
            }});
            await Blog.findOneAndUpdate({_id:blog._id},{"$inc":{'metadata.totalComments':1}})
        }
    }catch(e){
        console.log(e);
        return res.status(500).json({error:"Something went wrong"});
    }
}

const getComments = async(req,res)=>{
    const {blogId,parentCommentId,offset,limit} = req.query;
    try{
        const curBlog = await Blog.findOne({blogId:blogId});
        if(!curBlog)return res.status(400).json({error:"Blog does not exist"});
        if(parentCommentId){
            const parentComment = await Comment.findOne({commentId:parentCommentId})
            .populate("commentedBy","name username profileImg -_id");
            const _parentComment = {
                commentId:parentComment.commentId,
                isAuthor:parentComment.isAuthor,
                content:parentComment.content,
                isReplied:parentComment.isReplied,
                commentedBy:parentComment.commentedBy,
                commentedAt:parentComment.commentedAt,
                blogId:parentComment.blogId,
                isEditable:parentComment.commentedBy?.username===req?.user?.username,
            }
            const comments = await Comment.find({blogId:curBlog._id,parentComment:parentCommentId})
            .populate("commentedBy","name username profileImg -_id")
            .sort({"commentedAt":-1})
            .skip(offset||0)
            .limit(limit||6);
            const _comments = comments.map(c=>{
                return {
                    commentId:c.commentId,
                    isAuthor:c.isAuthor,
                    content:c.content,
                    isReplied:c.isReplied,
                    commentedBy:c.commentedBy,
                    commentedAt:c.commentedAt,
                    blogId:c.blogId,
                    isEditable:c.commentedBy?.username===req?.user?.username,
                }
            })
            return res.status(200).json({parentComment:_parentComment,comments:_comments});      
        }else{
            const comments = await Comment.find({blogId:curBlog._id,parentComment:null})
            .populate("commentedBy","name username profileImg -_id")
            .sort({"commentedAt":-1})
            .skip(offset||0)
            .limit(limit||6);
            const _comments = comments.map(c=>{
                return {
                    commentId:c.commentId,
                    isAuthor:c.isAuthor,
                    content:c.content,
                    isReplied:c.isReplied,
                    commentedBy:c.commentedBy,
                    blogId:c.blogId,
                    commentedAt:c.commentedAt,
                    isEditable:c.commentedBy?.username===req?.user?.username,
                }
            })
            return res.status(200).json({comments:_comments}); 
        }
    }catch(e){
        console.log(e);
        return res.status(500).json({error:"Something went wrong"});
    }
}

const deleteComments = async(req,res)=>{
    const {commentId} = req.query;
    try{
        const curUser = req.user;
        const curComment = await Comment.findOne({commentId:commentId,commentedBy:curUser._id});
        if(!curComment)return res.status(400).json({error:"No such comment found"});
        const curBlogId = curComment.blogId;
        await Comment.deleteOne({commentId:commentId});
        res.status(200).json({status:"Ok"});
        const deletedDocument = await Comment.deleteMany({commentPath:{"$in":commentId}});
        const count = deletedDocument.deletedCount +1 || 1;
        const blog = await Blog.findOneAndUpdate({_id:curBlogId},{"$inc":{'metadata.totalComments':-count}})
    }catch(e){
        console.log(e);
        return res.status(500).json({error:"Something went wrong"});
    }
}


module.exports = {newComment,getComments,deleteComments}
