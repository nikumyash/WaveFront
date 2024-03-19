import { useCallback, useEffect, useState,useRef } from "react"
import Editor from "../components/Editor"
import EditorNavbar from "../components/EditorNavbar"
import TextArea from "react-textarea-autosize";
import {useDispatch} from "react-redux";
import { setContent, setTitle } from "../slice/editorSlice";

const EditorPage = () => {
  const dispatch = useDispatch();
  const handleTextArea = useCallback((e)=>{
    if(e.keyCode==13)e.preventDefault();
  },[]);
  const [publishForm,setPublishForm] = useState(false);
  const ejref = useRef();
  const handlePublishClick = useCallback(async ()=>{
    dispatch(setContent(await ejref.current.saver.save()));
  },[dispatch]);
  useEffect(()=>{
    if(publishForm)handlePublishClick();
  },[publishForm,handlePublishClick])
  return (
    <section>
      <EditorNavbar publishForm={publishForm} setPublishForm={setPublishForm}/>
      <div className={`max-w-3xl px-2 mx-auto ${publishForm?"hidden":""}` }>
        <div className="mt-8 mb-2">
          <TextArea onKeyDown={handleTextArea} maxLength={150} onChange={(e)=>dispatch(setTitle(e.target.value))} placeholder="Title" className="resize-none focus:border-l w-full h-auto pl-4 focus:border-gray-500 text-gray-500 outline-none text-4xl font-thin font-serif"/>  
        </div>
        <Editor forwardRef={ejref}/>
      </div>
    </section>
  )
}

export default EditorPage