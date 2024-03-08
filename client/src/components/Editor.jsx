/* eslint-disable react/prop-types */
import EditorJS from "@editorjs/editorjs"
import ImageTool from "@editorjs/image"
import CodeBox from '@bomdi/codebox';
import Header from "@editorjs/header"
import { useCallback,useEffect,useMemo } from "react";
import { uploadImageS3 } from "../utils/uploadImage";
import {useDispatch} from "react-redux"
import { addImages } from "../slice/editorSlice";

const Editor = ({initialData,forwardRef}) => {
  const dispatch = useDispatch();
  const EDITOR_JS_TOOLS = useMemo(()=>{
    return {
      image:{
        class:ImageTool,
        config:{
          captionPlaceholder:"Image",
          uploader:{
            uploadByUrl:(e)=>{
              let pr = new Promise((resolve,reject)=>{
                try{
                  resolve(e);
                }
                catch(err){
                  reject(err);
                }
              })
              dispatch(addImages(e)) 
              return pr.then(url=>{
                return {
                  success:1,
                  file:{
                    url
                  }
                }
              })
            },
            uploadByFile:(e)=>{
              return uploadImageS3(e).then(res=>{
                if(res)
                { 
                  dispatch(addImages(res));
                  return{
                    success:1,
                    file:{
                      url:res
                    }
                  }
                }
                else{
                  return {
                    success:0,
                  }
                }
              })
            }
          }
        }
      },
      codeBox:{
        class:CodeBox,
      },
      header:{
        class:Header,
        config:{
          levels:[2,3,4],
          defaultLevel:3
        }
      }
    }
  },[dispatch]);
  const initEditor = useCallback(()=>{
      const editor = new EditorJS({
        holder:"editorjs",
        data:initialData|| null,
        onReady:()=>{
          forwardRef.current = editor;
        },
        placeholder:"Tell your story...",
        tools:EDITOR_JS_TOOLS,
      })
      forwardRef.current = editor;
    },[EDITOR_JS_TOOLS,initialData,forwardRef]);
    useEffect(() => {
      if (forwardRef.current == null) {
        initEditor();
      }
      return () => {
        forwardRef?.current?.destroy();
        forwardRef.current = null;
      };
    }, [initialData,forwardRef,initEditor]);
  return (
      <div className="w-full">
        <div id="editorjs" className="w-full"></div>
      </div>
  )
}

export default Editor