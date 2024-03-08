import { useEffect,useState} from "react";
import { customAxios } from "../utils/axios";
import notify from "react-hot-toast";
import {useNavigate} from "react-router-dom";
 
const RecommendedTopics = () => {
  const [topic,setTopic] = useState([]);
  const navigateTo = useNavigate();
  useEffect(()=>{
    customAxios.get("/topic/top").then(res=>{
      setTopic(res?.data?.topics);
    }).catch(()=>{
      notify("Some thing went wrong. Please reload the page. If the problem persists contact us");
    })
  },[])
  return (
    <>
      {topic && <div className="w-full my-4">
          <h1 className="text-lg font-semibold">Recommended Topics</h1>
          <div className="flex my-4 flex-wrap gap-2 overflow-hidden">
            {topic.map((t,i)=><p key={i} onClick={()=>navigateTo("/topic/"+t?.name)} className="text-md px-2 py-1 cursor-pointer bg-gray-100 rounded-full w-fit">{t?.name}</p>)}
          </div>
      </div>}
    </>
  )
}

export default RecommendedTopics