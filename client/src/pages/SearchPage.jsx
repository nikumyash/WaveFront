import {useSearchParams} from "react-router-dom"
import BlogsDisplay from "../components/BlogsDisplay";
import UserDisplay from "../components/UserDisplay";
import TopicDisplay from "../components/TopicDisplay";
import BlogMatching from "../components/BlogMatching";
import TopicMatching from "../components/TopicMatching";
import PeopleMatching from "../components/PeopleMatching";

const SearchPage = () => {
  const [searchQuery,setSearchQuery] = useSearchParams();
  return (
    <section className="m-auto max-w-[1336px] flex justify-evenly">
    <section className="flex w-full mx-auto max-w-7xl min-h-screen justify-evenly">
      <div className="w-full flex justify-center max-w-[900px] flex-1">
        <div className="lg:mx-16 w-full">
          <div className="my-8 w-full px-2 items-center gap-4 flex">
              <h1 className="text-5xl text-gray-500 font-semibold">Results for</h1>
              <h1 className="text-5xl font-bold">{decodeURIComponent(searchQuery.get("q"))}</h1>
          </div>
          <div className="flex mt-6 w-full text-sm relative border-b border-gray-300">  
            <div className={`px-4 py-2 capitalize cursor-pointer ${searchQuery.get("type")==="" || searchQuery.get("type")===null?" font-bold ":""} `} onClick={()=>setSearchQuery({type:"",q:searchQuery.get("q")})} >Stories</div>
            <div className={`px-4 py-2 capitalize cursor-pointer ${searchQuery.get("type")==="users"?" font-bold ":""} `} onClick={()=>setSearchQuery({type:"users",q:searchQuery.get("q")})} >People</div>
            <div className={`px-4 py-2 capitalize cursor-pointer ${searchQuery.get("type")==="topics"?" font-bold ":""} `} onClick={()=>setSearchQuery({type:"topics",q:searchQuery.get("q")})} >Topics</div>
          </div>
          {(searchQuery.get("type")===""|| searchQuery.get("type")===null) && <BlogsDisplay q={searchQuery.get("q")}/>}
          {(searchQuery.get("type")==="users") && <UserDisplay q={searchQuery.get("q")}/>}
          {(searchQuery.get("type")==="topics") && <TopicDisplay q={searchQuery.get("q")}/>}
        </div>
      </div>
      <div className="w-[300px] h-[90vh] max-lg:hidden border-l border-gray-200 flex-none px-6">
        <div className="w-full h-full relative my-8">
          {!(searchQuery.get("type")===""|| searchQuery.get("type")===null) && <BlogMatching q={searchQuery.get("q")}/>}
          {!(searchQuery.get("type")==="topics") && <TopicMatching q={searchQuery.get("q")}/>}
          {!(searchQuery.get("type")==="users") &&<PeopleMatching q={searchQuery.get("q")}/>}
          <h1 className="fixed right-8 bottom-0">@made by Yash Nikum</h1>
        </div>
      </div>
    </section>
  </section>
  )
}

export default SearchPage