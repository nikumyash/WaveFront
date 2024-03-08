import { useEffect } from "react";
import {useSelector,useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import { setSigninModal } from "../slice/modalSlice";

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({children}) => {
    const user = useSelector(state=>state.user.user);
    const navigateTo = useNavigate();
    const dispatch = useDispatch();
    useEffect(()=>{
        if(!user){
            dispatch(setSigninModal({isOpen:true,data:null}));
            navigateTo("/");
        }
    },[user,dispatch,navigateTo])
    return (
        <>{children}</>
    )
}

export default ProtectedRoute