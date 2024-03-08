/* eslint-disable react/prop-types */
import { useCallback } from "react";
import {useNavigate} from "react-router-dom";
import { customAxios } from "../utils/axios";
import notify from "react-hot-toast";

// eslint-disable-next-line react/prop-types
const ProfileInfo = ({user,setProfileInfo,username,totalFollowers,isFollowed,isSelf}) => {
  const nFormatter = useCallback((num)=>{
    if (num >= 1000000000) {
       return (num / 1000000000).toFixed(2).replace(/\.0$/, '') + 'G';
    }
    if (num >= 1000000) {
       return (num / 1000000).toFixed(2).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
       return (num / 1000).toFixed(2).replace(/\.0$/, '') + 'K';
    }
    return num;
  },[]);
  const handleFollow = ()=>{
    customAxios.post("/user/"+username+"/follow").then((res)=>{
      setProfileInfo(state=>{return {...state,user:{...user,totalFollowers:totalFollowers+1},isFollowed:true}})
    }).catch(()=>{
      notify("Something went wrong");
    })
  }
  const handleUnfollow = ()=>{
    customAxios.post("/user/"+username+"/unfollow").then((res)=>{
      setProfileInfo(state=>{return {...state,user:{...user,totalFollowers:totalFollowers-1},isFollowed:false}})
    }).catch(()=>{
      notify("Something went wrong");
    })
  }
  const navigateTo = useNavigate();
  return (
    <div className="mx-4 w-full flex flex-col">
        <div className="h-28 w-28 overflow-hidden bg-gray-300 rounded-full">
          <img src={user?.profileImg} className="h-full w-auto object-cover"/>
        </div>
        <h1 className="text-2xl font-semibold" >{user?.name}</h1>
        <p className="text-md font-semibold" >{nFormatter(totalFollowers)} Followers</p>
        <p className="text-md my-1 text-gray-700">{user?.bio}</p>
        {isSelf? 
        <h1 onClick={()=>navigateTo("/me/settings")} className="text-green-700 font-semibold my-4 text-md cursor-pointer">Edit Profile</h1>
        :
        isFollowed? <div onClick={()=>handleUnfollow()} className="text-green-700 cursor-pointer w-fit border rounded-full my-4 border-green-700 px-2 py-1 text-md">Following</div> 
        :
        <div onClick={()=>handleFollow()} className="text-white rounded-full w-fit cursor-pointer bg-green-700 my-4 px-2 py-1 text-md">Follow</div>}
    </div>
  )
}

export default ProfileInfo