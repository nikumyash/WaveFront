import { useEffect, useState } from "react"
import { customAxios } from "../utils/axios";
import notify from "react-hot-toast";
import { Link } from "react-router-dom";
import timeSetter from "./../utils/time";

// eslint-disable-next-line react/prop-types
const PopularBlog = () => {
  const timeAgo = new timeSetter('en-US')
   const [blogs,setBlogs]= useState();
   useEffect(()=>{
    customAxios.get("/blog/popular?limit=3").then(res=>{
        setBlogs(res.data.blogs);
    }).catch(()=>{
        notify("Something went wrong");
    })
   },[])
  return (
    <div className="w-full">
      <h1 className="font-semibold text-lg">Popular Blogs</h1>
        {blogs && blogs.length===0 && <div className="w-full text-md">No blogs found</div>}
        {blogs && blogs.map((blog,i)=>(
            <div key={i} className="w-full my-4 flex  flex-col">
                <div className="flex items-center gap-2">
                  <Link to={"/u/"+blog.author.username} className="h-6 w-6 rounded-full overflow-hidden"><img src={blog.author.profileImg}/></Link>
                  <Link to={"/u/"+blog.author.username} className="text-md line-clamp-1">{blog.author.name}</Link>
                </div>
                <Link to={"/p/"+blog.blogId} className="text-md font-semibold">{blog.title}</Link>
                <p className="text-gray-700 text-sm">{timeAgo.format(new Date(blog.publishedAt))}</p>
            </div>
        ))}
        <Link to={"/popular"} className="text-green-700 font-semibold">Show More</Link>
    </div>
  )
}

export default PopularBlog