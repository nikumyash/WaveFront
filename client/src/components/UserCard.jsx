/* eslint-disable react/prop-types */
import { Link } from "react-router-dom"

const UserCard = ({name,username,profileImg,bio}) => {
  return (
    <div className="flex px-4 py-4 w-full justify-between items-center border-b border-gray-200 ">
        <div className="flex gap-4 items-center">
            <Link to={"/u/"+username} className="h-16 w-16 bg-gray-300 overflow-hidden rounded-full">
              {profileImg && <img className="w-full h-full object-cover" src={profileImg}/>}
              </Link>
            <div className="mx-4 my-4 flex flex-col ">
                <Link to={"/u/"+username} className="text-lg font-semibold line-clamp-1">{name}</Link>
                <Link to={"/u/"+username} className="text-md text-gray-700 line-clamp-1">{bio}</Link>
            </div>
        </div>
        <Link to={"/u/"+username} className="px-2 py-1 border border-gray-700 rounded-full">Visit profile</Link>
    </div>
  )
}

export default UserCard