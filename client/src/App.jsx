import {Routes,Route,BrowserRouter} from "react-router-dom"
import EditorPage from "./pages/EditorPage"
import ModalLayout from "./layouts/ModalLayout"
import HomeLayout from "./layouts/HomeLayout"
import HomePage from "./pages/HomePage"
import ConfirmLogin from "./pages/ConfirmLogin"
import ProfilePage from "./pages/ProfilePage"
import ProtectedRoute from "./components/ProtectedRoute"
import ProfileBlog from "./components/ProfileBlog"
import AboutSection from "./components/AboutSection"
import TopicPage from "./pages/TopicPage"
import BlogPage from "./pages/BlogPage"
import SettingsPage from "./pages/SettingsPage"
import ConfirmEmailChange from "./pages/ConfirmEmailChange"
import EditBlog from "./pages/EditBlog"
import NotFound from "./pages/NotFound"
import SearchPage from "./pages/SearchPage"
import ManageBlogs from "./pages/ManageBlogs"
import PopularPage from "./pages/PopularPage"

function App() {
  return (
    <section className="overflow-x-hidden">
    <BrowserRouter>
      <ModalLayout>
        <Routes>
          <Route path="/" element={<HomeLayout/>}>
            <Route index element={<HomePage/>}/>
            <Route path="u/:slug" element={<ProfilePage/>}>
              <Route index element={<ProfileBlog/>}/>
              <Route path="about" element={<AboutSection/>}/>
            </Route> 
            <Route path="p/:slug" element={<BlogPage/>}/>
            <Route path="search" element={<SearchPage/>}/>
            <Route path='/topic/:slug' element = {<TopicPage/>}/>
            <Route path='/me/settings' element={<ProtectedRoute><SettingsPage/></ProtectedRoute>}/>
            <Route path='/me/stories' element={<ProtectedRoute><ManageBlogs/></ProtectedRoute>}/>
            <Route path="/popular" element={<PopularPage/>}/>
          </Route>
          <Route path='/p/:slug/edit' element={<ProtectedRoute><EditBlog/></ProtectedRoute>}/>
          <Route path="/auth" element={<ConfirmLogin/>} />
          <Route path="/changemail" element={<ConfirmEmailChange/>}/>
          <Route path='/editor' element={<ProtectedRoute><EditorPage/></ProtectedRoute>}/>
          <Route path="*" element={<NotFound/>}/>
        </Routes>
      </ModalLayout>
    </BrowserRouter>
    </section>
  )
}

export default App
