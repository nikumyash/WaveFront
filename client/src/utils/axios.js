import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { refreshToken } from "../slice/userSlice.js";

export const customAxios = axios.create({baseURL:import.meta.env.VITE_SERVER_URL,withCredentials:true});

export const setupAxios = (store)=>{
    customAxios.interceptors.request.use(async(config)=>{
        const user = store?.getState().user;
        if(user?.accessToken && !user?.isRefreshing){
            let curDate = new Date();
            const decodedToken = jwtDecode(user?.accessToken);
            if(decodedToken.exp * 1000 < curDate.getTime()){
                await store.dispatch(refreshToken());
            }
            if(config?.headers){
                config.headers["x-a-t"] = `Bearer ${
                    store?.getState()?.user?.accessToken
                }`;
            }
        }
        return config;
    },(error)=>Promise.reject(error));
}
