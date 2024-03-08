import * as Dialog from "@radix-ui/react-dialog";
import {useSelector,useDispatch} from "react-redux"
import {setUpdateProfileModal} from "../slice/modalSlice";
import { customAxios } from "../utils/axios";
import notify from "react-hot-toast";
import { updateProfile } from "../slice/userSlice";
import { useState } from "react";
import axios from 'axios'

const UpdateProfileModal = () => {
      // eslint-disable-next-line react/prop-types
        const dispatch = useDispatch();
        const modalData = useSelector(state=>state.modal.updateprofileModal);
        const [profilePic,setProfilePic] = useState(modalData.data.photo);
        const [name,setName] = useState(modalData.data.name);
        const [bio,setBio] = useState(modalData.data.bio);
        const handleInputChange = (e)=>{
            const img = e.target.files[0];
            customAxios.get("/uploadImage").then((res)=>{
                let url = res?.data?.uploadUrl;
                axios.put(url,img,{
                    headers:{
                        "Content-Type":'multipart/form-data'
                    }
                }).then(()=>{
                    setProfilePic(url.split("?")[0])
                });
                e.target.files = null;
            }).catch(e=>{
                notify("Something went wrong while uploading the image.")
            })             
        }
        const handleSubmit =()=>{
            customAxios.post("/user/update/profile",{name:name,photo:profilePic,bio:bio}).then(res=>{
                dispatch(updateProfile(res?.data));
                dispatch(setUpdateProfileModal({isOpen:!modalData.isOpen,data:null}))
            }).catch(()=>{
                notify("Something went wrong.");
            })
        }
        return ( 
          <Dialog.Root open={modalData.isOpen} onOpenChange={()=>dispatch(setUpdateProfileModal({isOpen:!modalData.isOpen,data:null}))}>
          <Dialog.Portal>
            <Dialog.Overlay/>
            <Dialog.Content className="fixed left-[50%] bg-white top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg sm:rounded-lg">
              <h1 className='text-3xl py-4 font-serif text-center'>Profile Information</h1>
              <div>
                <div className="text-md text-gray-500 my-2">Photo</div>
                <div className="flex flex-row items-center">
                    <input id="fileInput" accept="image/*" type="file" onChange={handleInputChange} className="hidden"/>
                    <label htmlFor="fileInput" className="h-24 flex-shrink-0 cursor-pointer w-24 aspect-square rounded-full overflow-hidden bg-gray-300"><img src={profilePic} className="h-full w-full object-cover"/></label>
                    <div className="pl-4 w-full">
                        <div className="flex gap-4">
                            <label htmlFor="fileInput" className="text-green-700 cursor-pointer outline-none">Update</label>
                            <button onClick={()=>setProfilePic("")} className="text-red-700 outline-none">Remove</button>
                        </div>
                        <h3 className="text-sm">Recommended: Square JPG, PNG, or GIF, at least 1,000 pixels per side.</h3>
                    </div>
                </div>
                <div className="w-full my-4">
                    <div className="text-md text-gray-500 my-2">Name*</div>
                    <div className="flex gap-4 items-center">
                        <input maxLength={50} defaultValue={name || ""} onChange={(e)=>setName(e.target.value)} className="w-full border-b border-gray-300 focus:border-gray-700 text-sm outline-none py-2" />
                    </div>
                </div>
                <div className="w-full my-4">
                    <div className="text-md text-gray-500 my-2">Bio</div>
                    <div className="flex gap-4 items-center">
                        <input maxLength={160} defaultValue={bio || ""} onChange={(e)=>setBio(e.target.value)} className="w-full border-b border-gray-300 focus:border-gray-700 text-sm outline-none py-2" />
                    </div>
                    <h3 className="text-sm">Max Length:- 160 characters</h3>
                </div>
                <div className="flex mx-auto gap-2 w-fit">
                    <button onClick={()=>handleSubmit()} type="submit" className="block mx-auto whitespace-nowrap bg-black text-white rounded-full px-4 hover:bg-opacity-80 py-2">
                        Confirm
                    </button>
                    <button onClick={()=>dispatch(setUpdateProfileModal({isOpen:!modalData.isOpen,data:null}))} className="block mx-auto whitespace-nowrap text-black bg-white rounded-full px-4 hover:bg-opacity-80 py-2">
                        Cancel
                    </button>
                </div>
              </div>
              <Dialog.Close><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
  )
}

export default UpdateProfileModal