import {useDispatch,useSelector} from "react-redux";
import { removePreviewImage, setPreviewImage } from "../slice/editorSlice";

const PreviewImageSelect = () => {
    const editorState = useSelector(state=>state.editor);
    const dispatch = useDispatch();
  return (
    <div className={`bg-gray-50 group h-[300px] w-full relative max-lg:aspect-video flex ${!editorState.previewImage && editorState?.images?.length>0?"overflow-scroll":"justify-center overflow-hidden items-center"} `}>
        {editorState.previewImage?
        <>
        <img className="absolute h-auto object-cover m-16" src={editorState?.previewImage}/>
        <button onClick={()=>dispatch(removePreviewImage())} className="rounded-full hidden transition-opacity ease-in-out duration-700 group-hover:opacity-70 group-hover:block text-xs px-2 py-1 md:text-lg md:px-4 md:py-2 z-10 bg-white">Click here to change Preview Image</button>
        </>
        :   editorState?.images?.length>0? 
        editorState.images.map((e,i)=><img key={i} src={e} onClick={()=>dispatch(setPreviewImage(e))} className={`${editorState.previewImage===e?"border border-green-500":""} w-24 h-24 m-1`} />) 
        :
        <p className="text-sm text-gray-500 m-16 text-center">Include a high-quality image in your story to make it more inviting to readers.</p>
        }
    </div>
  )
}

export default PreviewImageSelect