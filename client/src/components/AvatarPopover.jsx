import * as Popover from '@radix-ui/react-popover';
import * as Separator from '@radix-ui/react-separator';
import {useSelector,useDispatch} from "react-redux";
import {logoutUser} from "./../slice/userSlice.js";
import {useNavigate} from "react-router-dom";


const AvatarPopover = () => {
    const user = useSelector(state=>state.user.user);
    const navigateTo = useNavigate();
    const dispatch = useDispatch();
 return (
    <>
    <Popover.Root>
        <Popover.Trigger>
            <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-300" >
                {user?.profilePic && <img className="w-full h-full object-cover" src={user.profilePic}/>}
            </div>
        </Popover.Trigger>
        <Popover.Portal>
        <Popover.Content align='end' sideOffset={5} className='w-64 border-[1px] z-50 border-gray-300 bg-white shadow-lg rounded-md'>
            <>
                <div className='w-full px-6 my-4 text-md text-gray-700'>
                    <div className='my-2'>
                        <div onClick={()=>navigateTo("/editor")} className='flex cursor-pointer items-center my-4'>
                            <div className='mr-2 inline-block'>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-label="Write">
                                    <path d="M14 4a.5.5 0 0 0 0-1v1zm7 6a.5.5 0 0 0-1 0h1zm-7-7H4v1h10V3zM3 4v16h1V4H3zm1 17h16v-1H4v1zm17-1V10h-1v10h1zm-1 1a1 1 0 0 0 1-1h-1v1zM3 20a1 1 0 0 0 1 1v-1H3zM4 3a1 1 0 0 0-1 1h1V3z" fill="currentColor"></path><path d="M17.5 4.5l-8.46 8.46a.25.25 0 0 0-.06.1l-.82 2.47c-.07.2.12.38.31.31l2.47-.82a.25.25 0 0 0 .1-.06L19.5 6.5m-2-2l2.32-2.32c.1-.1.26-.1.36 0l1.64 1.64c.1.1.1.26 0 .36L19.5 6.5m-2-2l2 2" stroke="currentColor"></path>
                                </svg>  
                            </div>
                            <span>Write</span>
                        </div>
                    </div>
                </div>
                <Separator.Root className="bg-gray-300 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full" />
                <div className='w-full px-6 my-4 text-md text-gray-700'>
                    <div className='my-2'>
                        <div onClick={()=>navigateTo("/u/"+user?.username)}  className='flex items-center cursor-pointer my-4'>
                            <div className='mr-2 inline-block'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                            </div>
                            <span>Profile</span>
                        </div>
                        <div onClick={()=>navigateTo("/me/stories")} className='flex cursor-pointer items-center my-4'>
                            <div className='mr-2 inline-block'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6h4"/><path d="M2 10h4"/><path d="M2 14h4"/><path d="M2 18h4"/><rect width="16" height="20" x="4" y="2" rx="2"/><path d="M9.5 8h5"/><path d="M9.5 12H16"/><path d="M9.5 16H14"/></svg>            
                            </div>
                            <span>Stories</span>
                        </div>
                    </div>
                </div>
                <Separator.Root className="bg-gray-300 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full" />
                <div onClick={()=>navigateTo("/me/settings")} className='w-full cursor-pointer px-6 my-4 text-md text-gray-700'>
                    <div className='my-2'>
                        Settings
                    </div>
                </div>
                <Separator.Root className="bg-gray-300 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full" />
                <div className='w-full px-6 my-4 text-md text-gray-700 cursor-pointer'>
                    <div onClick={()=>{dispatch(logoutUser()); navigateTo("/")}} className='my-2'>
                        Sign out
                        <span className='block'>{user?.email}</span>
                    </div>
                </div>
            </>
        </Popover.Content>
        </Popover.Portal>
    </Popover.Root>
  </>
  )
}

export default AvatarPopover;