import {useState,useEffect} from "react";
import { customAxios } from "../utils/axios";
import notify from "react-hot-toast";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import ShareBlogPopover from "../components/ShareBlogPopover";

const ManageBlogs = () => {
    const navigateTo = useNavigate();
    const username = useSelector(state=>state?.user?.user?.username);
    const [blogs,setBlogs] = useState([]);
    const [needFetching,setNeedFetching] = useState(false);
    const [end,setEnd] = useState(false); 
    useEffect(()=>{
        customAxios.get("/blog/u/"+username).then((res)=>{
            if(res.data.blogs.length < 8){
                setEnd(true);
            }
            setBlogs(res?.data?.blogs);
        }).catch(()=>{
            notify("Something went wrong. Please reload the page. If the problem persists contact us.")
            navigateTo("/notfound");
        })
    },[navigateTo,username]);
    useEffect(()=>{
        if(needFetching && !end){
          customAxios.get("/blog/u/"+username+"?offset="+blogs.length).then(res=>{
            if(res.data.blogs.length < 8){
              setEnd(true);
            }
            setBlogs(blogs=>[...blogs,...res.data.blogs]);
            setNeedFetching(false);
          }).catch(()=>{
            notify("Something went wrong. Please reload the page. If the problem persists contact us.");
          });
        }
      },[needFetching,username,blogs,end])
      useEffect(()=>{
        const onScroll = ()=>{
          if(window.innerHeight+window.scrollY>=window.document.body.offsetHeight-10){
            setNeedFetching(true);
          }
        }
        window.addEventListener("scroll",onScroll);
        return ()=>window.removeEventListener("scroll",onScroll);
      },[])
      console.log(blogs);
    return (
    <div className="w-full">
        <div className="w-full h-48 flex-col flex gap-2 mt-4 justify-center items-center">
            <h1 className="text-4xl font-bold capitalize">Manage Blogs</h1>
        </div>
        <div className="w-full flex justify-center border-t mx-auto border-gray-200 max-w-[900px] flex-1">
                <div className="w-full my-8">
                    {blogs && blogs.map((blog,i)=>(
                    <div key={i} className="py-2 px-2 flex gap-1 flex-col w-full border-b border-gray-200">
                        <h1 className="text-md font-semibold">{blog.title}</h1>
                        <p className="text-md text-gray-700">{blog.subtitle}</p>
                        <div className="flex justify-between">
                            <p className="text-gray-700 text-sm">Published at {new Date(blog?.publishedAt).toDateString().split(' ').slice(1).join(' ')}</p>
                            <ShareBlogPopover blogId={blog.blogId} isEditable={true}/>
                        </div>
                    </div>))}
                    {blogs && blogs.length==0 && <div className="text-lg text-center">No blogs found</div>}
                    {!end && <div className="flex w-full my-8 justify-center items-center"> 
                    <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-700" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg></div>}
                </div>
        </div>
    </div>
  )
}

export default ManageBlogs