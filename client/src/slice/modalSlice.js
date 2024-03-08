import {createSlice} from "@reduxjs/toolkit"

const modalSlice = createSlice({
    name:"modal",
    initialState:{
        signupModal:{
            isOpen:false,
            data:null
        },
        signinModal:{
            isOpen:false,
            data:null
        },
        successModal:{
            isOpen:false,
            data:null
        },
        errorModal:{
            isOpen:false,
            error:null,
        },
        emailModal:{
            isOpen:false,
            data:null,
        },
        usernameModal:{
            isOpen:false,
            data:null,
        },
        updateprofileModal:{
            isOpen:false,
            data:null,
        },
        commentModal:{
            isOpen:false,
            data:{
                parentComment:null,
                reply:false,
                curBlog:null,
            },
        }
    },
    reducers:{
        setSignupModal:(state,action)=>{
            state.signupModal = action.payload
        },
        setSigninModal:(state,action)=>{
            state.signinModal = action.payload
        },
        setSuccessModal:(state,action)=>{
            state.successModal = action.payload
        },
        setErrorModal:(state,action)=>{
            state.errorModal = action.payload
        },
        setEmailModal:(state,action)=>{
            state.emailModal = action.payload
        },
        setUsernameModal:(state,action)=>{
            state.usernameModal = action.payload;
        },
        setUpdateProfileModal:(state,action)=>{
            state.updateprofileModal = action.payload;
        },
        setCommentModal:(state,action)=>{
            state.commentModal = action.payload;
        }
    }
})

export const {setSigninModal,setSignupModal,setCommentModal,setSuccessModal,setErrorModal,setEmailModal,setUsernameModal,setUpdateProfileModal} = modalSlice.actions

export default modalSlice.reducer;