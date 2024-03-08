import {useSelector,useDispatch} from "react-redux"
import { setEmailModal, setUpdateProfileModal, setUsernameModal } from "../slice/modalSlice";
import {useNavigate} from "react-router-dom";
import { useEffect } from "react";

const SettingsPage = () => {
    const dispatch = useDispatch();
    const user = useSelector(state=>state?.user?.user)
    const navigateTo = useNavigate();
    useEffect(()=>{
        if(!user)navigateTo("/");
    },[user,navigateTo]);
  return (
    <section className="flex mx-auto max-w-7xl min-h-screen px-4 justify-evenly">
        <div className="w-full flex justify-center max-w-[900px] flex-1">
          <div className="lg:mx-16 w-full">
            <div className="font-bold my-8 text-4xl">
                <h1 className="">Settings</h1>
            </div>
            <div className="flex mt-6 w-full relative border-b border-gray-300">
                <div className={"py-2 capitalize text-sm cursor-pointer"}>Account</div>
            </div>
            <div className="mt-12">
                <div className="flex justify-between my-6 cursor-pointer" onClick={()=>dispatch(setEmailModal({isOpen:true,data:user?.email}))}>
                    <h3>Email address</h3>
                    <h3>{user?.email}</h3>
                </div>
                <div className="flex justify-between my-6 cursor-pointer" onClick={()=>dispatch(setUsernameModal({isOpen:true,data:user?.username}))}>
                    <h3>Username</h3>
                    <h3>{user?.username}</h3>
                </div>
                <div onClick={()=>dispatch(setUpdateProfileModal({isOpen:true,data:{name:user?.name,photo:user?.profilePic,bio:user?.bio}}))} className="flex items-center justify-between my-6 cursor-pointer">
                    <div>
                        <h3 className="text-md">Profile Information</h3>
                        <h3 className="text-sm">Edit your photo,name,bio.</h3>
                    </div>
                    <div className="flex gap-4 items-center">
                        <h3 className="text-md">{user?.name}</h3>
                        <div className="w-12 h-12 overflow-hidden rounded-full bg-gray-300"><img className="w-full h-full object-cover" src={user?.profilePic}/></div>
                    </div>
                </div>
                <div className="cursor-pointer">
                    <h3 className="text-md text-red-700">Delete your account</h3>
                    <h3 className="text-sm">Permanently delete your account and all of your content</h3>
                </div>
            </div>
          </div>
        </div>
    </section>
  )
}

export default SettingsPage