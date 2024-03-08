import {Link} from "react-router-dom"
import timeSetter from "./../utils/time";
// eslint-disable-next-line react/prop-types
const BlogCard = ({title,subtitle,previewImg,publishedAt,profileImg,authorUsername,authorName,blogId,topics}) => {
    const timeAgo = new timeSetter('en-US');
  return (
    <div className="flex w-full border-b border-gray-200 ">
        <div className="mx-4 my-4 flex flex-col w-full">
            <div className="flex items-center gap-2">
                {/* profile photo */}
                {<Link to={"/u/"+authorUsername} className="bg-gray-500 overflow-hidden w-6 h-6 rounded-full cursor-pointer">
                    {profileImg && <img src={profileImg} className="object-cover h-full w-auto"/>}
                </Link>}
                {/* name */}
                <Link to={"/u/"+authorUsername} className="text-sm cursor-pointer">{authorName}</Link>
                {/* time */}
                <p className="text-sm text-gray-500">{timeAgo.format(new Date(publishedAt))}</p>
            </div>
            {/* blog content title subtitle image */}
            <div className="flex gap-8">
                <div className="flex flex-col flex-1 my-2">
                    <Link to={"/p/"+blogId} className="font-bold line-clamp-2 cursor-pointer text-xl">{title}</Link>
                    <p className="text-md hidden sm:block line-clamp-2">{subtitle}</p>
                </div>
                {/* image */}
                {<Link to={"/p/"+blogId} className="max-sm:h-20 cursor-pointer max-sm:max-w-20 max-w-28 h-28 flex-1 bg-gray-500">
                    {previewImg && <img src={previewImg} className="h-full w-auto object-cover"/> } 
                </Link>}
            </div>
            {/* other utils */}
            {topics && <div className="w-full">
                <Link to={"/topic/"+topics[0]} className="text-sm px-2 py-1 cursor-pointer bg-gray-100 rounded-full w-fit">{topics[0]}</Link>
            </div>}
        </div>
    </div>
  )
}

export default BlogCard