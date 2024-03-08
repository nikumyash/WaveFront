import { useEffect } from "react";
import {useDispatch} from "react-redux";
import { customAxios } from "../utils/axios";
import {useLocation,useNavigate} from "react-router-dom"
import { updateEmailRefreshProfile } from "../slice/userSlice";
import notify from "react-hot-toast";

const ConfirmEmailChange = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const token = new URLSearchParams(location.search).get('token');
    const navigateTo = useNavigate();
    useEffect(()=>{
        customAxios.post("/user/update/email/check?token="+token).then(res=>{
            dispatch(updateEmailRefreshProfile(res.data));
            notify("Email updated successfully");
            navigateTo("/");
        }).catch(()=>{
            notify("Error occurred while updating email");
            navigateTo("/");
        })
    },[token,dispatch,navigateTo])
  return (
    <div>Loading....Please wait for a while</div>
  )
}

export default ConfirmEmailChange