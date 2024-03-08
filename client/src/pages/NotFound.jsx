import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"

const NotFound = () => {
  return (
        <section className="w-screen h-screen overflow-hidden">
            <Navbar/>
            <section className="w-screen h-[90%] flex flex-col items-center justify-center">
                <h1 className="text-5xl font-bold my-8">Page Not Found</h1> 
                <div><img src="/404-page-animation-example.gif"/></div>
                <Link to="/" className="text-lg py-2 px-4 rounded-full text-white bg-black">Go to Home</Link>
            </section>
        </section>
    )
}

export default NotFound