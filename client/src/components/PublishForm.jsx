import {useDispatch,useSelector} from "react-redux";
import { resetEditor, setSubtitle } from "../slice/editorSlice";
import TopicInput from "./TopicInput";
import {customAxios} from "./../utils/axios";
import {useNavigate} from "react-router-dom";
import notify from "react-hot-toast";
import PreviewImageSelect from "./PreviewImageSelect";

// eslint-disable-next-line react/prop-types
const PublishForm = ({slug,edit,setOpen}) => {
  const dispatch = useDispatch();
  const editorState = useSelector(state=>state.editor);
  const userState = useSelector(state=>state?.user?.user?.name);
  const navigateTo = useNavigate();
  const handleSubmit = async ()=>{
    let data = {
      title:editorState.title,
      subtitle:editorState.subtitle,
      previewImage:editorState.previewImage,
      content:editorState.content,
      topics:editorState.topics      
    };
    try{
      if(data?.subtitle?.length === 0){
        notify("Please enter a subtitle for your blog.");
        return;
      }
      let res;
      if(!edit){
        res = await customAxios.post("/blog/create",data);
      }
      else{
        res = await customAxios.post("/blog/"+slug+"/edit",data);
      }
      dispatch(resetEditor());
      navigateTo("/p/"+res.data.url);
    }catch(e){
      notify("Something went wrong");
    }
    
  }
  return (
    <>
    {<div className="w-screen flex items-center justify-center h-screen z-50 top-0 absolute overflow-hidden bg-white">
        <div className="flex lg:flex-1 flex-col w-[90vw] min-h-[70vh] lg:flex-row items-center justify-center lg:max-w-[1000px] lg:h-[80vh] relative">
          <div className="p-10 flex-1 lg:w-1/2 max-lg:w-full min-h-[60%]">
            <h1 className="font-bold text-lg text-gray-500">Story Preview</h1>
            <PreviewImageSelect/>
            <input type="text" maxLength={160} defaultValue={editorState?.subtitle || ""} placeholder="Write a preview subtitle" onChange={(e)=>dispatch(setSubtitle(e.target.value))} className="w-full font-medium pb-1 text-sm mt-4 outline-none border-b-2 border-gray-300"/>
          </div>
          <div className="p-10 flex-1 lg:w-1/2 max-lg:w-full text-gray-500 min-h-[60%]">
            <div className="text-lg my-4">Publishing to: <span className="font-semibold text-black">{userState.name}</span></div>
            <div className="text-sm my-4">Add or change topics (up to 5) so readers know what your story is about</div>
            <TopicInput/>
            <div className="text-sm my-4">Topic must only contain alphabets and numbers.</div>
            <div onClick={handleSubmit} className="block w-fit my-4 text-sm whitespace-nowrap bg-green-700 text-white rounded-full px-4 hover:bg-opacity-80 cursor-pointer py-2">
                Publish Now
            </div>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" onClick={()=>setOpen(false)} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 cursor-pointer h-6 absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </div>
    </div>}
    </>
  )
}

export default PublishForm