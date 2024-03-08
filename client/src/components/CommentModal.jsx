import * as Dialog from "@radix-ui/react-dialog";
import {useSelector,useDispatch} from "react-redux"
import notify from "react-hot-toast";
import { setCommentModal } from "../slice/modalSlice";
import TextArea from "react-textarea-autosize";
import Comment from "./Comment";
import timeSetter from "./../utils/time";
import { customAxios } from "../utils/axios";
import { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom";

// eslint-disable-next-line react/prop-types
const CommentModal = () => {
  const timeAgo = new timeSetter('en-US');
  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const modalData = useSelector(state=>state.modal.commentModal);
  const [commentData,setCommentData] = useState("");
  const [parentComment,setParentComment] = useState();
  const [comments,setComments] = useState([]);
  const [needFetching,setNeedFetching] = useState(false);
  const [end,setEnd] = useState(false);

  useEffect(()=>{  
      if(modalData.data.parentComment){
          customAxios.get("/comment?blogId="+modalData.data.curBlog+"&parentCommentId="+modalData.data.parentComment).then((res)=>{
              if(res.data.comments.length < 6){
                  setEnd(true);
                }
              setComments(res?.data?.comments);
              setParentComment(res?.data?.parentComment);
            }).catch(()=>{
                notify("Something went wrong");
            })
        }else{
            customAxios.get("/comment?blogId="+modalData.data.curBlog).then((res)=>{
                if(res?.data?.comments.length < 6){
                    setEnd(true);
                }
                setComments(res?.data?.comments);
            }).catch(()=>{
                notify("Something went wrong");
            })
        }
    },[modalData.data.curBlog,modalData.data.parentComment])
  useEffect(()=>{
    if(needFetching && !end){
        if(modalData.data.parentComment){
            customAxios.get("/comment?blogId="+modalData.data.curBlog+"&parentCommentId="+modalData.data.parentComment+"&offset="+comments.length).then((res)=>{
                setComments(state=>[...state,...res.data.comments]);
                if(res.data.comments.length < 6){
                    setEnd(true);
                }
            }).catch(()=>{
                notify("Something went wrong");
            })
        }else{
            customAxios.get("/comment?blogId="+modalData.data.curBlog+"&offset="+comments.length).then((res)=>{
                setComments(state=>[...state,...res.data.comments]);
                if(res.data.comments.length < 6){
                    setEnd(true);
                }
            }).catch(()=>{
                notify("Something went wrong");
            })
        }
    }
  },[needFetching,modalData.data.parentComment,modalData.data.curBlog,comments,end])
    const handleDelete = (id)=>{
        customAxios.post("/comment/delete?commentId="+id).then(()=>{
            setComments(state=>state.filter(e=>e.commentId!==id));
        }).catch(()=>{
            notify("Something went wrong");
        })
    }
    const handleUserLink =()=> {
      dispatch(setCommentModal({isOpen:false,data:{parentComment:null,reply:false,curBlog:null}}))
      navigateTo("/u/"+parentComment?.commentedBy?.username);
      }
    const handleCommentSubmit = ()=>{
      customAxios.post("/comment/new",{blogId:modalData.data.curBlog,parentCommentId:modalData.data.parentComment,content:commentData}).then((res)=>{
          setComments(state=>[res?.data?.comment,...state])
          setCommentData("");
      }).catch(()=>{
          notify("Something went wrong");
      })
    } 
    const handleParentDelete = ()=>{
        customAxios.post("/comment/delete?commentId="+parentComment.commentId).then(()=>{
            notify("Comment deleted");
            dispatch(setCommentModal({isOpen:true,data:{parentComment:null,reply:false,curBlog:modalData.data.curBlog}}));
        }).catch(()=>{
            notify("Something went wrong");
        })
    }

    return ( 
    <Dialog.Root open={modalData.isOpen} onOpenChange={()=>dispatch(setCommentModal({isOpen:!modalData.isOpen,data:{parentComment:null,reply:false,curBlog:null}}))}>
    <Dialog.Portal>
      <Dialog.Overlay/>
      <Dialog.Content className="fixed right-0 bg-white overflow-y-auto top-0 z-50 grid  border bg-background shadow-lg sm:rounded-lg">
        <div className="h-screen w-screen xs:w-96">
            <div className="p-6 w-full h-full">
                <div className="my-4">
                    <h1 className="font-semibold text-lg">Comments</h1>
                </div>
                {/* Add Comment */}
                {!(modalData.data.parentComment && parentComment) ?<div className="w-full my-4 border-b border-gray-300">
                    <div className="bg-gray-200 p-2 rounded-md min-h-24 w-full">
                        <TextArea onChange={(e)=>setCommentData(e.target.value)} value={commentData} placeholder="Leave a comment" maxLength={160} className="w-full h-auto resize-none bg-gray-200 outline-none"/>
                    </div>
                    <button onClick={()=>handleCommentSubmit()} className="outline-none bg-green-700 text-white px-4 py-1 rounded-full my-4">Comment</button>
                </div>
                :
                <div className="w-full p-4 my-4 flex gap-2 shadow-md flex-col border">
                    <div className="w-full flex gap-2 justify-between items-center text-gray-700">
                        <div className="flex gap-2 w-full items-center">
                            <div onClick={()=>handleUserLink()} className="w-8 h-8 rounded-full cursor-pointer bg-gray-300 overflow-hidden"><img src={parentComment?.commentedBy?.profileImg} className="w-full h-full object-cover"/></div>
                            <div className="">
                                <div className="flex gap-2">
                                    <h3 onClick={()=>handleUserLink()} className="text-sm cursor-pointer">{parentComment?.commentedBy?.name}</h3>  
                                    {parentComment?.isAuthor && <div className="bg-green-700 text-xs px-1 flex items-center justify-center cursor-default text-white"><p>AUTHOR</p></div>}
                                </div>
                                <h3 className="text-sm text-gray-700">{timeAgo.format(new Date(parentComment?.commentedAt))}</h3>
                            </div>
                        </div>
                        {parentComment?.isEditable && <div className="">
                            <svg onClick={()=>handleParentDelete()} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 cursor-pointer h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                        </div>}
                    </div>
                    <p className="text-md">{parentComment?.content}</p>
                    {!modalData.data.reply?<div className="flex">
                        <div onClick={()=>dispatch(setCommentModal({isOpen:true,data:{parentComment:modalData.data.parentComment,reply:true,curBlog:modalData.data.curBlog}}))} className="underline cursor-pointer">Reply</div>
                    </div>
                    :
                    <>
                        <div className="bg-gray-200 p-2 rounded-md min-h-24 w-full">
                            <TextArea value={commentData} onChange={(e)=>setCommentData(e.target.value)} placeholder="Reply to this comment" maxLength={160} className="w-full h-auto resize-none bg-gray-200 outline-none"/>
                        </div>
                        <div className="w-full flex gap-2">
                            <button onClick={()=>handleCommentSubmit()} className="px-2 py-1 outline-none bg-green-700 w-fit text-white rounded-full">Reply</button>
                            <button onClick={()=>{setCommentData("");dispatch(setCommentModal({isOpen:true,data:{parentComment:modalData.data.parentComment,reply:false,curBlog:modalData.data.curBlog}}))}} className="px-2 py-1 outline-none">Cancel</button>
                        </div>
                    </>}
                </div>}
                {modalData.data.parentComment &&  <div className="text-md font-semibold">Replies</div>}
                <div className="w-full my-4">
                    {comments && comments.map((comment,i)=><Comment key={i} isEditable={comment.isEditable} handleDelete={handleDelete} profileImg={comment.commentedBy.profileImg} commentId={comment.commentId} curBlog={modalData.data.curBlog} name={comment.commentedBy.name} username={comment.commentedBy.username} content={comment.content} isAuthor={comment.isAuthor} isReplied={comment.isReplied} commentedAt={comment.commentedAt}/>)}
                </div>
                {end && comments.length==0 && (modalData.data.parentComment?
                <div className="w-full flex items-center py-4 justify-center"><p className="">Be the first one to reply to this comment.</p></div>
                :
                <div className="w-full flex items-center py-4 justify-center"><p className="">Be the first one to comment on this post.</p></div>)}
                
                
                {!end && (needFetching ?<div className="flex w-full my-8 justify-center items-center"> 
                <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-700" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg></div>:<div className="w-full flex items-center py-4 justify-center"><button onClick={()=>setNeedFetching(true)} className="text-white outline-none bg-black px-2 py-1 rounded-full">Load More</button></div>)}
            </div>
        </div>
        <Dialog.Close><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 fixed xs:absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
  )
}

export default CommentModal