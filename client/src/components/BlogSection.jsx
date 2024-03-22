import { useEffect,useState } from 'react';
import {useParams} from "react-router-dom";
import { customAxios } from '../utils/axios';
import notify from "react-hot-toast";
import Output from "editorjs-react-renderer"
import ShareBlogPopover from "./ShareBlogPopover";  
import {useNavigate,Link} from "react-router-dom"
import {useDispatch,useSelector} from "react-redux";
import { setCommentModal } from '../slice/modalSlice';
import { setSigninModal } from '../slice/modalSlice';

const BlogSection = () => {
    const {slug} = useParams();
    const curUser = useSelector(state=>state.user.user);
    const dispatch = useDispatch();
    const navigateTo = useNavigate();
    const [blog,setBlog] = useState(null);
    useEffect(()=>{
        customAxios.get("/blog/"+slug).then(res=>{
            setBlog(res?.data);
        }).catch(()=>{
            notify("Something went wrong. Please Refresh the page. If the problem still persists contact us.")
            navigateTo("/notfound");
        })
    },[slug,navigateTo]);
    const handleLike = ()=>{
        if(!curUser){
            dispatch(setSigninModal({isOpen:true,data:null}));
            navigateTo("/");
            return;
        }
        customAxios.post("/blog/"+slug+"/like").then(()=>{
            let tempBlog = {...blog};
            tempBlog.blog.metadata.totalLikes+=1;
            tempBlog.isLiked = true;
            setBlog(tempBlog);
        }).catch(()=>{
            notify("Something went wrong");
        })
    }
    const handleUnlike = ()=>{
        if(!curUser){
            dispatch(setSigninModal({isOpen:true,data:null}));
            navigateTo("/");
            return;
        }
        customAxios.post("/blog/"+slug+"/unlike").then(()=>{
            let tempBlog = {...blog};
            tempBlog.blog.metadata.totalLikes-=1;
            tempBlog.isLiked = false;
            setBlog(tempBlog);
        }).catch(()=>{
            notify("Something went wrong");
        })
    }
    useEffect(()=>{
        customAxios.post("/view?blogId="+slug).then(()=>{
            console.log("Done");
        }).catch(e=>{
            console.log(e);
        })
    },[slug])
  return (
    <section className='w-screen px-4 pb-16'>
        {/* heading */}
        <div className='pt-12 w-full mx-auto max-w-[700px]'>
            <h1 className='font-bold text-4xl'>{blog?.blog?.title}</h1>
        </div>
        {/* Author */}
        <div className='py-8 w-full flex items-center gap-2 mx-auto max-w-[700px]'>
            <Link to={"/u/"+blog?.blog?.author?.username}  className='w-12 h-12 rounded-full overflow-hidden bg-gray-300'><img className='h-full w-full object-cover' src={blog?.blog?.author?.profileImg}/></Link>
            <div className=''>
                <Link to={"/u/"+blog?.blog?.author?.username} className='text-md'>{blog?.blog?.author?.name}</Link>
                <h2 className='text-sm text-gray-500'>{new Date(blog?.blog?.publishedAt).toDateString().split(' ').slice(1).join(' ')}</h2>
            </div>
        </div>
        <div className='w-full flex text-gray-500 items-center justify-between px-4 my-4 gap-2 py-3 mx-auto max-w-[700px] border-y border-gray-200'>
            <div className='flex items-center gap-4 '>
                <div className='flex items-center gap-2'>
                    {blog?.isLiked ?
                        <svg onClick={()=>handleUnlike()} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 cursor-pointer">
                            <path d="M7.493 18.5c-.425 0-.82-.236-.975-.632A7.48 7.48 0 0 1 6 15.125c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75A.75.75 0 0 1 15 2a2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23h-.777ZM2.331 10.727a11.969 11.969 0 0 0-.831 4.398 12 12 0 0 0 .52 3.507C2.28 19.482 3.105 20 3.994 20H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 0 1-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227Z" />
                        </svg>                      
                    : 
                    <svg onClick={()=>handleLike()} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 cursor-pointer">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
                    </svg>}
                    <p>{blog?.blog?.metadata?.totalLikes}</p>
                </div>
                <div className='flex items-center gap-2'>
                    <svg onClick={()=>dispatch(setCommentModal({isOpen:true,data:{parentComment:null,reply:false,curBlog:blog?.blog.blogId}}))} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 cursor-pointer">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
                    </svg>
                    <p>{blog?.blog?.metadata?.totalComments}</p>
                </div>
            </div>
            <div className='flex items-center justify-center'>
                <ShareBlogPopover blogId={blog?.blog.blogId} isEditable={blog?.isEditable}/>
            </div>
       </div>
        <div className='mx-auto w-full prose max-w-[700px]'>
            <Output data={blog?.blog?.content}/>
        </div>
        <div className='w-full mt-16 mb-4 flex items-center flex-wrap gap-2 mx-auto max-w-[700px]'>
            {blog?.blog?.topics.map((topic,i)=><div key={i} className='py-2 px-3 bg-gray-200 rounded-full text-md'>{topic}</div>)}
        </div>
        <div className='w-full flex text-gray-500 items-center justify-between px-4 my-8 gap-2 py-3 mx-auto max-w-[700px]'>
            <div className='flex items-center gap-4 '>
                <div className='flex items-center gap-2'>
                    {blog?.isLiked ?
                        <svg onClick={()=>handleUnlike()} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 cursor-pointer">
                            <path d="M7.493 18.5c-.425 0-.82-.236-.975-.632A7.48 7.48 0 0 1 6 15.125c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75A.75.75 0 0 1 15 2a2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23h-.777ZM2.331 10.727a11.969 11.969 0 0 0-.831 4.398 12 12 0 0 0 .52 3.507C2.28 19.482 3.105 20 3.994 20H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 0 1-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227Z" />
                        </svg>                      
                    : 
                    <svg onClick={()=>handleLike()} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 cursor-pointer">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
                    </svg>}
                    <p>{blog?.blog?.metadata?.totalLikes}</p>
                </div>
                <div className='flex items-center gap-2'>
                    <svg onClick={()=>dispatch(setCommentModal({isOpen:true,data:{parentComment:null,reply:false,curBlog:blog?.blog?.blogId}}))} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 cursor-pointer">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
                    </svg>
                    <p>{blog?.blog?.metadata?.totalComments}</p>
                </div>
            </div>
            <div className='flex items-center justify-center'>
                <ShareBlogPopover blogId={blog?.blog.blogId} isEditable={blog?.isEditable}/>
            </div>
        </div>         
    </section>
  )
}

export default BlogSection