import {useParams} from "react-router-dom";
import ProfileInfo from "../components/ProfileInfo";
import { useEffect,useState } from "react";
import { customAxios } from "../utils/axios";
import notify from "react-hot-toast";
import {useNavigate,useLocation} from "react-router-dom"
import ProfileBlog from "../components/ProfileBlog";
import AboutSection from "../components/AboutSection";

const ProfilePage = () => {
  const {slug} = useParams();
  const lt = useLocation();
  const [profileInfo,setProfileInfo] = useState();
  const navigateTo = useNavigate();
  useEffect(()=>{
    customAxios.get("/user/"+slug).then(res=>{
      setProfileInfo(res?.data);
    }).catch(()=>{
      notify("Something went wrong.Please reload the page. If the problem persists contact us.");
      navigateTo("/notfound");        
      })
    },[slug,navigateTo]);
    return (
    <section className="m-auto max-w-[1336px] flex justify-evenly">
      <section className="flex w-full mx-auto max-w-7xl min-h-screen justify-evenly">
        <div className="w-full flex justify-center max-w-[900px] flex-1">
          <div className="lg:mx-16 w-full">
            {/* Profile info */}
            <div className="my-8 w-full items-center gap-4 flex">
              <div className="h-28 w-28 lg:hidden bg-gray-300 overflow-hidden rounded-full">
                <img className="w-full h-full object-cover" src={profileInfo?.user?.profileImg}/>
              </div>
              <h1 className="text-3xl md:text-5xl px-6 font-semibold">{profileInfo?.user?.name}</h1>
            </div>
            <div className="flex w-full mt-6 text-sm relative border-b border-gray-300 overflow-x-auto">
              <div className={`px-4 py-2 capitalize cursor-pointer ${lt.pathname== ("/u/"+slug) ?" font-bold ":""} `} onClick={()=>navigateTo("/u/"+slug)}>Home</div>
              <div className={`px-4 py-2 capitalize cursor-pointer ${lt.pathname== ("/u/"+slug+"/about")? " font-bold ":""}`} onClick={()=>navigateTo("/u/"+slug+"/about")}>About</div>
            </div>
            {lt.pathname== ("/u/"+slug) && <ProfileBlog/>}
            {lt.pathname== ("/u/"+slug+"/about") && <AboutSection isSelf={profileInfo?.isSelf} date={profileInfo?.user?.joinedAt} bio={profileInfo?.user?.bio} email={[profileInfo?.user.email]}/>}
          </div>
        </div>
        <div className="w-[300px] h-[90vh] max-lg:hidden border-l border-gray-200 flex-none px-6">
          <div className="w-full h-full relative my-8">
            {profileInfo && <ProfileInfo user={profileInfo.user} setProfileInfo={setProfileInfo} username={profileInfo?.user?.username} totalFollowers={profileInfo?.user?.totalFollowers} isFollowed={profileInfo?.isFollowed} isSelf={profileInfo?.isSelf}/>}
            <h1 className="fixed right-8 bottom-0">@made by Yash Nikum</h1>
          </div>
        </div>
      </section>
    </section>
  )
}

export default ProfilePage