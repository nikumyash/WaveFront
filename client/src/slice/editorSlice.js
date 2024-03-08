import {createSlice} from "@reduxjs/toolkit";

const editorSlice = createSlice({
    name:"editor",
    initialState:{
        title:"",
        subtitle:"",
        previewImage:"",
        content:[],
        topics:[],
        images:[],
    },
    reducers:{
        setTitle:(state,action)=>{
            state.title = action.payload;
        },
        setContent:(state,action)=>{
            state.content = action.payload;
        },
        addImages:(state,action)=>{
            state.images = [...state.images,action.payload];
        },
        setPreviewImage:(state,action)=>{
            state.previewImage = action.payload;
        },
        setSubtitle:(state,action)=>{
            state.subtitle = action.payload;
        },
        addTopic:(state,action)=>{
            state.topics = [...state.topics,action.payload];
        },
        setTopic:(state,action)=>{
            state.topics = action.payload
        },
        removePreviewImage:(state)=>{
            state.previewImage = "";
        },
        resetEditor:(state)=>{
            state.title= "";
            state.subtitle = "";
            state.previewImage ="";
            state.content =[];
            state.topics =[];
            state.images =[];
        },
        setEditorState:(state,action)=>{
            state.title= action.payload.title;
            state.subtitle = action.payload.subtitle;
            state.previewImage =action.payload.previewImg;
            state.content =action.payload.content;
            state.topics =action.payload.topics;
            let temparr = []; 
            for(let i of action.payload.content.blocks){
                if(i.type==="image"){
                    temparr.push(i.data.file.url);
                }
            }
            state.images =temparr;
            temparr = null;
        }
    },
})

export default editorSlice.reducer;
export const {setTitle,setContent,addImages,setPreviewImage,setSubtitle,addTopic,setTopic,resetEditor,setEditorState,removePreviewImage} = editorSlice.actions

