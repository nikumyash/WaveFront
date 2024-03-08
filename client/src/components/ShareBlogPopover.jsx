/* eslint-disable react/prop-types */
import * as Popover from '@radix-ui/react-popover';
import {useNavigate,useLocation} from "react-router-dom";
import notify from "react-hot-toast";
import { customAxios } from '../utils/axios';

const ShareBlogPopover = ({isEditable,blogId}) => {
    const location = useLocation();
    const navigateTo = useNavigate();
    const handleDelete = ()=>{
        customAxios.post("/blog/"+blogId+"/delete").then(()=>{
            navigateTo("/");
        }).catch(()=>{
            notify("Something went wrong.");
        })
    }
    return (
    <Popover.Root>
        <Popover.Trigger>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 cursor-pointer">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
        </Popover.Trigger>
        <Popover.Portal>
        <Popover.Content align='end' sideOffset={5} className='w-32 border-[1px] z-50 border-gray-300 bg-white shadow-lg rounded-md'>
            <>
                <div className='px-4'>
                    {isEditable && <button onClick={()=>navigateTo(location.pathname+"/edit")} className='block my-2 pl-2'>
                        Edit
                    </button>}
                    <button onClick={()=>{navigator.clipboard.writeText(window.location); notify("Link copied");}} className='block my-2 pl-2'>
                        Copy Link
                    </button>
                    {isEditable && <button onClick={()=>handleDelete()} className='block my-2 pl-2'>
                        Delete Blog
                    </button>}
                </div>
            </>
        </Popover.Content>
        </Popover.Portal>
    </Popover.Root>
  )
}

export default ShareBlogPopover