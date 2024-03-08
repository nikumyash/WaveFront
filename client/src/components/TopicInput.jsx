import {useSelector,useDispatch} from "react-redux";
import { addTopic, setTopic } from "../slice/editorSlice";

// eslint-disable-next-line react/prop-types
const Topic = ({topic,delFunc,id})=>{
  return (
    <div className="px-2 py-1 border gap-1 flex items-center w-fit bg-white rounded-full border-gray-300 hover:border-gray-500 text-xs">
      {topic}
      <svg xmlns="http://www.w3.org/2000/svg" onClick={()=>delFunc(id)} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 cursor-pointer">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
      </svg>
    </div>
  )
}
const TopicInput = () => {
  const dispatch = useDispatch();
  const topics = useSelector(state=>state?.editor?.topics);
  const handleKeyDown = (e)=>{
    if(e.keyCode== 188 || e.keyCode== 13){
      e.preventDefault(e);
      if(/^[a-zA-Z0-9]+$/.test(e.target.value)){
        dispatch(addTopic(e.target.value.replace()));
      }
      e.target.value="";
    }
  }
  const delFunc = (id)=>{
    let gg = [...topics].filter((_,i)=>i!==id);
    dispatch(setTopic(gg));
  }
  return (
    <div className="w-full rounded-sm flex flex-wrap gap-2 py-4 my-4 text-sm bg-gray-50 border border-gray-300 pl-4">
        {topics.map((e,i)=><Topic key={i} delFunc={delFunc} id={i} topic={e}/>)} 
        {topics?.length<5 && <input type="text" placeholder="Add a Topic..." onKeyDown={handleKeyDown} className="bg-gray-50 text outline-none"/>}    
    </div>
  )
}

export default TopicInput