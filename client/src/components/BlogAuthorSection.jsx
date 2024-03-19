import { useEffect,useState } from "react";
import {useParams,useNavigate} from "react-router-dom";
import { customAxios } from "../utils/axios";
import notify from "react-hot-toast";

const BlogAuthorSection = () => {
  const {slug} = useParams();
  const navigateTo = useNavigate();
  const [data,setData] = useState()
  useEffect(()=>{
    customAxios.get("/blog/"+slug+"/suggested").then((res)=>{
      setData(res?.data);
    }).catch(()=>{
      notify("Something went wrong.");
    })
  },[slug])
  return (
    <section className="w-screen bg-gray-100 py-12">
        <div className='w-full mx-auto max-w-[700px]'>
            <div className="w-full px-4 pb-8">
                <div className="flex items-center justify-between px-4">
                  <div onClick={()=>navigateTo("/u/"+data?.author?.username)} className="h-20 w-20 cursor-pointer rounded-full overflow-hidden">
                    <img src={data?.author?.profileImg} className="h-full w-full object-cover"/>
                  </div>
                  <div className="px-2 py-1 w-fit h-fit text-md border border-gray-700 rounded-full">Visit Profile</div>
                </div>
                <div className="w-full my-4">
                  <div onClick={()=>navigateTo("/u/"+data?.author?.username)} className="text-2xl cursor-pointer font-semibold">Written by {data?.author?.name}</div>
                </div>
                <div className="w-full my-2">
                  <p>{data?.author?.bio}</p>
                </div>
            </div>
            {data?.blogs.length>0 && (<div className="w-full py-12 border-y border-gray-300">
              <div className="w-full grid grid-flow-row gap-4 grid-cols-1 sm:grid-cols-2">
                {data?.blogs.map((blog,i)=>(
                  <div key={i} className="w-full px-4 flex flex-col gap-1">
                    <div onClick={()=>navigateTo("/p/"+blog?.blogId)} className="aspect-video cursor-pointer bg-gray-300 w-full">
                      {blog?.previewImg && <img className="h-full w-full object-cover" src={blog?.previewImg}/>}
                    </div>
                    <div className="w-full">
                        <h1 onClick={()=>navigateTo("/p/"+blog?.blogId)} className="w-full line-clamp-2 cursor-pointer text-lg font-semibold">{blog.title}</h1>
                        <p className="my-1 w-full text-gray-700 line-clamp-2 text-md">{blog?.subtitle}</p>
                    </div>
                    <div className="text-gray-700 text-sm">
                        {new Date(blog?.publishedAt).toDateString().split(' ').slice(1).join(' ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>)}
            {data && <div onClick={()=>navigateTo("/u/"+data.author.username)} className="py-1 mt-8 mx-4 px-2 rounded-full cursor-pointer border border-gray-500 my-4 w-fit">Read more from {data?.author?.name}</div>}
        </div>
    </section>
  )
}

export default BlogAuthorSection