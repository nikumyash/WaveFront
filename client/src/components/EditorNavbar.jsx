import {Link} from 'react-router-dom'
import AvatarPopover from "./AvatarPopover"
import {useSelector} from "react-redux"
import { createPortal } from 'react-dom';
import PublishForm from './PublishForm';
import toast from "react-hot-toast"

// eslint-disable-next-line react/prop-types
const EditorNavbar = ({edit,slug,publishForm,setPublishForm}) => {
    const title = useSelector(state=>state?.editor?.title);
    const checkContents = ()=>{
        if(title===""){
            toast("Please Enter a Title for your Blog");
        }
        else setPublishForm(true);
    }
  return (
    <>
        <div className="z-50 sticky top-0 flex items-center gap-2 md:gap-12 w-full p-[5vw] md:px-[10vw] py-5 border-b h-14 border-grey bg-white">
            <Link to="/" className="flex-none w-10">
                <img src="/logo.png"/>
            </Link>
            <p className='text-black line-clamp-1 text-md w-full'>
                {title || "New Draft"}
            </p>
            <div className='flex gap-4 ml-auto'>
                <button onClick={checkContents} className="flex items-center justify-center whitespace-nowrap bg-green-700 text-white text-sn rounded-full px-2 hover:bg-opacity-80">
                    Publish
                </button>
                {publishForm && createPortal(<PublishForm slug={slug} edit={edit} isOpen={publishForm} setOpen={setPublishForm}/>,document.body)}
                <div className='flex items-center justify-center cursor-pointer'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                    </svg>
                </div>
                <AvatarPopover/>
            </div>
        </div>
    </>
  )
}

export default EditorNavbar