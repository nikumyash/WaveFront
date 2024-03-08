import { useEffect,useState } from "react";
import {useLocation,useNavigate} from "react-router-dom"

// eslint-disable-next-line react/prop-types
const TabSwitch = ({topics}) => {
    const navigateTo = useNavigate();
    const location = useLocation();
    const [lt,setlt] = useState("");
    useEffect(()=>{
        setlt(location);
    },[location])
    return (
    <>
    <div className="flex mt-6 w-full text-sm relative border-b border-gray-300">
        {/* eslint-disable-next-line react/prop-types */}
        {topics.map((e,i)=>{if(e==="Home") 
        return (<div key={i} className={`px-2 py-2 capitalize cursor-pointer ${lt.pathname== ("/")&& lt.search=="" ?" font-bold ":""} `} onClick={()=>navigateTo("/")}>Home</div>)
        else return <div key={i} className={`px-2 py-2 capitalize cursor-pointer ${lt.search=="?topic="+e ? " font-bold ":""}`} onClick={()=>navigateTo("/?topic="+e)}>{e}</div>})}
    </div>
    </>
  )
}

export default TabSwitch