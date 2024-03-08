import { useEffect, useState } from "react"
import { customAxios } from "../utils/axios";
import notify from "react-hot-toast";
import { Link } from "react-router-dom";


// eslint-disable-next-line react/prop-types
const PeopleMatching = ({q}) => {
   const [users,setUsers]= useState();
   useEffect(()=>{
    customAxios.get("/user?limit=3&q="+q).then(res=>{
        setUsers(res.data.users);
    }).catch(()=>{
        notify("Something went wrong");
    })
   },[q])
  return (
    <div className="w-full my-8">
      <h1 className="font-semibold text-lg">People matching {q}</h1>
        {users && users.length===0 && <div className="w-full text-md">No users found</div>}
        {users && users.map((user,i)=>(
            <div key={i} className="w-full my-4 flex gap-2 flex-col">
                <div className="flex items-center gap-2">
                  <Link to={"/u/"+user.username} className="h-6 w-6 rounded-full overflow-hidden"><img src={user.profileImg}/></Link>
                  <Link to={"/u/"+user.username} className="text-md line-clamp-1">{user.name}</Link>
                </div>
            </div>
        ))}
        <Link to={"/search?type=users&q="+q} className="text-green-700 font-semibold">Show More</Link>
    </div>
  )
}

export default PeopleMatching