import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import { customAxios } from "../utils/axios";
import { setSigninModal, setSignupModal, setSuccessModal,setErrorModal } from "./modalSlice";

export const registerUser = createAsyncThunk("auth/signup",async (userData,thunkApi)=>{
    try{
        const res = await customAxios.post("/auth/signup",userData);
        console.log(res);
        thunkApi.dispatch(setSignupModal({isOpen:false,data:null}));
        thunkApi.dispatch(setSuccessModal({isOpen:true,data:userData.email}));
    }catch(e){
        console.log(e);
        const err = e.response.data;
        thunkApi.dispatch(setSignupModal({isOpen:false,data:null}));
        if(err.error==="User Already Exists")thunkApi.dispatch(setErrorModal({isOpen:true,error:{title:"Account already exists.",desc:"Email is already associated with another account."}}));
        else thunkApi.dispatch(setErrorModal({isOpen:true,error:{title:"Something went wrong.",desc:"Please try again later"}}));
    }
    return;
})

export const loginUser = createAsyncThunk("auth/login",async (userData,thunkApi)=>{
    try{
        const res = await customAxios.post("/auth/signin",userData);
        console.log(res);
        thunkApi.dispatch(setSigninModal({isOpen:false,data:null}));
        thunkApi.dispatch(setSuccessModal({isOpen:true,data:userData.email}));
    }catch(e){
        console.log(e);
        const err = e.response.data;
        thunkApi.dispatch(setSigninModal({isOpen:false,data:null}));
        if(err.error==="User not found")thunkApi.dispatch(setErrorModal({isOpen:true,error:{title:"User not found.",desc:"No user found with this email id. Please create a new account before trying again ."}}));
        else thunkApi.dispatch(setErrorModal({isOpen:true,error:{title:"Something went wrong.",desc:"Please try again later"}}));
    }
})

export const refreshToken = createAsyncThunk("auth/refresh",async (_,thunkApi)=>{
    try{
        const res = await customAxios.post("/auth/refresh",null,{withCredentials:true});
        localStorage.setItem("x-a-t",res?.data?.accessToken);
        return res?.data?.accessToken;
    }catch(e){
        thunkApi.dispatch(logoutUser());
    }
})
export const logoutUser = createAsyncThunk("auth/logout",async ()=>{
    try{
        await customAxios.post("/auth/logout",null,{withCredentials:true});
        localStorage.removeItem("user");
        localStorage.removeItem("x-a-t");
        return;
    }catch(e){
        console.log(e);
    }
})

export const checkAuth = createAsyncThunk("auth/check",async (userData)=>{
    try{
        const res = await customAxios.post("/auth/check?token="+userData.token);
        localStorage.setItem("user",JSON.stringify({email:res.data.email,bio:res.data.bio,name:res.data.name,profilePic:res.data.profilePic,followedTopics:res.data.followedTopics,username:res.data.username}));
        localStorage.setItem("x-a-t",res.data.accessToken);
        return res.data;
    }catch(e){
        console.log(e);
    }
})

export const handleGoogleAuthCheck = createAsyncThunk("auth/google",async(data)=>{
    try{
        const res = await customAxios.post("/auth/authwGoogle",data);
        console.log(res);
        localStorage.setItem("user",JSON.stringify({email:res.data.email,bio:res.data.bio,name:res.data.name,profilePic:res.data.profilePic,followedTopics:res.data.followedTopics,username:res.data.username}));
        localStorage.setItem("x-a-t",res.data.accessToken);
        return res.data;
    }catch(e){
        console.log(e);
    }
})


const userSlice = createSlice({
    name:"user",
    initialState:{
        user:JSON.parse(localStorage.getItem("user")) || null,
        accessToken:localStorage.getItem("x-a-t") || null,
        error:null,
        isRefreshing:false,
    },
    reducers:{
        updateUsername:(state,action)=>{
            let curUser = JSON.parse(localStorage.getItem("user"));
            curUser.username = action.payload;
            localStorage.setItem("user",JSON.stringify(curUser));
            state.user.username = action.payload;
        },
        updateProfile:(state,action)=>{
            let curUser = JSON.parse(localStorage.getItem("user"));
            curUser.name = action.payload.name;
            curUser.profilePic = action.payload.profileImg;
            curUser.bio = action.payload.bio;
            localStorage.setItem("user",JSON.stringify(curUser));
            state.user.name = action.payload.name;
            state.user.profilePic = action.payload.profileImg;
        },
        updateEmailRefreshProfile:(state,action)=>{
            let x = {email:action.payload.email,name:action.payload.name,profilePic:action.payload.profilePic,followedTopics:action.payload.followedTopics,username:action.payload.username};
            localStorage.setItem("user",JSON.stringify(x));
            localStorage.setItem("x-a-t",action.payload.accessToken);    
            state.accessToken = action.payload.accessToken;
            state.user = x;
        },
        addfollowedTopic:(state,action)=>{
            let curUser = JSON.parse(localStorage.getItem("user"));
            curUser.followedTopics = [...curUser.followedTopics,action.payload];
            console.log(curUser.followedTopics);
            localStorage.setItem("user",JSON.stringify(curUser));
            state.user.followedTopics = [...state.user.followedTopics,action.payload];
            // window.location.reload();
        },
        removeUnfollowedTopic:(state,action)=>{
            let curUser = JSON.parse(localStorage.getItem("user"));
            curUser.followedTopics = [...curUser.followedTopics].filter(e => e.name !== action.payload.name);
            localStorage.setItem("user",JSON.stringify(curUser));
            state.user.followedTopics = [...state.user.followedTopics].filter(e => e.name !== action.payload.name);
            // window.location.reload();
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(refreshToken.fulfilled,(state,action)=>{
            state.accessToken = action.payload;
            state.isRefreshing = false;
        })
        builder.addCase(refreshToken.rejected,(state,action)=>{
            state.error = action.payload;
            state.isRefreshing = false;
        })
        builder.addCase(logoutUser.fulfilled,(state)=>{
            state.accessToken = null;
            state.user = null;
        })
        builder.addCase(checkAuth.fulfilled,(state,action)=>{
            state.accessToken = action.payload.accessToken;
            state.user = {email:action.payload.email,bio:action.payload.bio,name:action.payload.name,profilePic:action.payload.profilePic,followedTopics:action.payload.followedTopics,username:action.payload.username};
        })
        builder.addCase(refreshToken.pending,(state)=>{
            state.isRefreshing = true;
        })
        builder.addCase(handleGoogleAuthCheck.fulfilled,(state,action)=>{
            state.accessToken = action.payload.accessToken;
            state.user = {email:action.payload.email,bio:action.payload.bio,name:action.payload.name,profilePic:action.payload.profilePic,followedTopics:action.payload.followedTopics,username:action.payload.username};
        })
    }
})
export const {updateProfile,updateUsername,updateEmailRefreshProfile,addfollowedTopic,removeUnfollowedTopic} = userSlice.actions;
export default userSlice.reducer;