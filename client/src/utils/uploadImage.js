import axios from "axios";
import { customAxios } from "./axios"

export const uploadImageS3 = async (img) =>{
    try{
        const res = await customAxios.get("/uploadImage");
        const url = res?.data?.uploadUrl;
        await axios.put(url,img,{
            headers:{
                "Content-Type":'multipart/form-data'
            }
        });
        return url.split("?")[0] ;
    }
    catch(e){
        return;
    }
}
