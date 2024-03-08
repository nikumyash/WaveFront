import { useCallback, useEffect, useState,useRef } from "react"
import Editor from "../components/Editor"
import EditorNavbar from "../components/EditorNavbar"
import TextArea from "react-textarea-autosize";
import {useDispatch,useSelector} from "react-redux";
import { resetEditor, setContent, setEditorState, setTitle } from "../slice/editorSlice";
import {useParams,useNavigate} from "react-router-dom";
import { customAxios } from "../utils/axios";
import notify from "react-hot-toast";

const EditBlog = () => {
  const {slug} = useParams();
  const navigateTo = useNavigate();
  const dispatch = useDispatch();
  const editorTitle = useSelector(state=>state?.editor?.title);
  const editorContent = useSelector(state=>state?.editor?.content);
  const handleTextArea = useCallback((e)=>{
    if(e.keyCode==13)e.preventDefault();
  },[]);
  const [publishForm,setPublishForm] = useState(false);
  const ejref = useRef();
  const handlePublishClick = useCallback(async ()=>{
    dispatch(setContent(await ejref.current.saver.save()));
  },[dispatch]);
  useEffect(()=>{
    customAxios.get("/blog/"+slug).then(res=>{
        if(!res.data.isEditable)navigateTo("/");
        dispatch(setEditorState(res.data.blog))
    }).catch(e=>{
        notify("Something went wrong");
        navigateTo("/notfound");
    })
    return ()=>{
        dispatch(resetEditor());
    }
  },[navigateTo,slug,dispatch]);
  useEffect(()=>{
    if(publishForm)handlePublishClick();
  },[publishForm,handlePublishClick])
  return (
    <section>
      <EditorNavbar edit={true} slug={slug} publishForm={publishForm} setPublishForm={setPublishForm}/>
      <div className={`max-w-3xl mx-auto ${publishForm?"hidden":""}` }>
        <div className="mt-8 mb-2">
          <TextArea onKeyDown={handleTextArea} defaultValue={editorTitle ||null} maxLength={150} onChange={(e)=>dispatch(setTitle(e.target.value))} placeholder="Title" className="resize-none focus:border-l w-full h-auto pl-4 focus:border-gray-500 text-gray-500 outline-none text-4xl font-thin font-serif"/>  
        </div>
        {editorTitle && <Editor initialData={editorContent} forwardRef={ejref}/>}
      </div>
    </section>
  )
}

export default EditBlog