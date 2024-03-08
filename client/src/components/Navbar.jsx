import { Link,useNavigate} from "react-router-dom"
import { useDispatch,useSelector } from 'react-redux'
import { setSigninModal, setSignupModal } from "../slice/modalSlice";
import AvatarPopover from "./AvatarPopover";
import { useState } from "react";

const Navbar = () => {
    const navigateTo = useNavigate();
    const [searchVisible,setSearchVisible] = useState();
    const [searchValue,setSearchValue] = useState();
    const user = useSelector(state=>state.user);
    const handleSearch = ()=>{
        if(searchValue)navigateTo("/search?q="+encodeURIComponent(searchValue))
    }
    const dispatch = useDispatch();
    return (
    <>
    <div className="z-50 sticky top-0 flex items-center gap-8 w-full px-[5vw] py-2 border-b h-14 border-grey bg-white">
        <Link to="/" className="flex-none w-10">
            <img src="/logo.png"/>
        </Link>
        <div className="rounded-full sm:flex hidden gap-2 items-center max-w-72 bg-gray-100 py-2 px-4">
            <svg onClick={()=>handleSearch()} width="24" height="24" className="text-gray-500 h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M4.1 11.06a6.95 6.95 0 1 1 13.9 0 6.95 6.95 0 0 1-13.9 0zm6.94-8.05a8.05 8.05 0 1 0 5.13 14.26l3.75 3.75a.56.56 0 1 0 .8-.79l-3.74-3.73A8.05 8.05 0 0 0 11.04 3v.01z" fill="currentColor"></path>
            </svg>
            <input onKeyUp={e=>{e.preventDefault(); if(e.key==="Enter"){handleSearch()}}} type="text" placeholder="Search" defaultValue={searchValue} onChange={(e)=>setSearchValue(e.target.value)} className="w-full bg-gray-100 text-gray-700 outline-none text-md h-full"/>
        </div>  
        <div className="flex items-center gap-3 md:gap-6 ml-auto">
            <div onClick={()=>setSearchVisible(!searchVisible)} className="sm:hidden block blocktext-gray-500 cursor-pointer">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M4.1 11.06a6.95 6.95 0 1 1 13.9 0 6.95 6.95 0 0 1-13.9 0zm6.94-8.05a8.05 8.05 0 1 0 5.13 14.26l3.75 3.75a.56.56 0 1 0 .8-.79l-3.74-3.73A8.05 8.05 0 0 0 11.04 3v.01z" fill="currentColor"></path>
                </svg>
            </div>
            {!user.user?<><div onClick={()=>dispatch(setSignupModal({isOpen:true,data:null}))} className="hidden md:flex whitespace-nowrap bg-green-700 text-white rounded-full px-4 hover:bg-opacity-80 cursor-pointer py-2">
                Sign Up
            </div>
            <div onClick={()=>dispatch(setSigninModal({isOpen:true,data:null}))} className="whitespace-nowrap bg-gray-100 text-gray-500 rounded-full px-4 hover:bg-opacity-80 cursor-pointer py-2">
                Sign In
            </div></>
            :<>
                <Link to="/editor" className="hidden md:flex gap-2 text-gray-500">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-label="Write">
                        <path d="M14 4a.5.5 0 0 0 0-1v1zm7 6a.5.5 0 0 0-1 0h1zm-7-7H4v1h10V3zM3 4v16h1V4H3zm1 17h16v-1H4v1zm17-1V10h-1v10h1zm-1 1a1 1 0 0 0 1-1h-1v1zM3 20a1 1 0 0 0 1 1v-1H3zM4 3a1 1 0 0 0-1 1h1V3z" fill="currentColor"></path><path d="M17.5 4.5l-8.46 8.46a.25.25 0 0 0-.06.1l-.82 2.47c-.07.2.12.38.31.31l2.47-.82a.25.25 0 0 0 .1-.06L19.5 6.5m-2-2l2.32-2.32c.1-.1.26-.1.36 0l1.64 1.64c.1.1.1.26 0 .36L19.5 6.5m-2-2l2 2" stroke="currentColor"></path>
                    </svg>
                    <p>Write</p>
                </Link>
                {/* <div className="flex justify-center items-center cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                    </svg>
                </div> */}
                <AvatarPopover/>
            </>}
        </div>
    </div>
    {searchVisible && <div className="h-20 mt-4 sm:hidden flex border-b border-gray-50 justify-center items-center w-full">
        <div className="rounded-full flex gap-2 items-center w-11/12 bg-gray-100 py-2 px-4">
            <svg onClick={()=>handleSearch()} width="24" height="24" className="text-gray-500 h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M4.1 11.06a6.95 6.95 0 1 1 13.9 0 6.95 6.95 0 0 1-13.9 0zm6.94-8.05a8.05 8.05 0 1 0 5.13 14.26l3.75 3.75a.56.56 0 1 0 .8-.79l-3.74-3.73A8.05 8.05 0 0 0 11.04 3v.01z" fill="currentColor"></path>
            </svg>
            <input onKeyUp={e=>{e.preventDefault(); if(e.key==="Enter"){handleSearch()}}} type="text" placeholder="Search" defaultValue={searchValue} onChange={(e)=>setSearchValue(e.target.value)} className="w-full bg-gray-100 text-gray-700 outline-none text-md h-full"/>
        </div>
    </div>}
    </>
  )
}

export default Navbar