import { useEffect,useState} from "react";
import { customAxios } from "../utils/axios";
import notify from "react-hot-toast";
import {useNavigate,Link} from "react-router-dom";
 
// eslint-disable-next-line react/prop-types
const TopicMatching = ({q}) => {
  const [topic,setTopic] = useState();
  const navigateTo = useNavigate();
  useEffect(()=>{
    customAxios.get("/topic?limit=6&q="+q).then(res=>{
      setTopic(res?.data?.topics);
    }).catch(()=>{
      notify("Some thing went wrong.");
    })
  },[q])
  return (
        <div className="w-full my-4">
            <h1 className="font-semibold text-lg">Topics matching {q}</h1>
            {topic && topic.length===0 && <div className="w-full text-md">No topics found</div>}
            {topic && <div className="flex my-2 flex-wrap gap-2 overflow-hidden">
                {topic.map((t,i)=><p key={i} onClick={()=>navigateTo("/topic/"+t?.name)} className="text-md px-2 py-1 cursor-pointer bg-gray-100 rounded-full w-fit">{t?.name}</p>)}
            </div>}
            <Link to={"/search?type=topics&q="+q} className="text-green-700 font-semibold">Show More</Link>
        </div>
  )
}

export default TopicMatching