import * as Dialog from "@radix-ui/react-dialog";
import {useSelector,useDispatch} from "react-redux"
import { setSignupModal,setSigninModal } from "../slice/modalSlice";
import { useForm } from "react-hook-form";
import { handleGoogleAuthCheck, registerUser } from "../slice/userSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import {z} from "zod"
import { authWithGoogle } from "../utils/firebase";
import notify from "react-hot-toast"

const schema = z.object({
  name:z.string().min(1,{message:"Username is required"}),
  email:z.string().min(1,{message:"Email is required"}).email({message:"Please enter a valid email address"}),
})
// eslint-disable-next-line react/prop-types
const SignupModal = () => {
  const dispatch = useDispatch();
  const {register,handleSubmit,formState:{errors}} = useForm({resolver:zodResolver(schema)});
  const modalData = useSelector(state=>state.modal.signupModal);
  const onSubmit =(data)=>{
    dispatch(registerUser(data));
  }
  const handleGoogleAuth = ()=>{
    authWithGoogle().then((result)=>{
        dispatch(handleGoogleAuthCheck({accessToken:result.user.accessToken}))
        dispatch(setSignupModal({isOpen:!modalData.isOpen,data:null}))
      }
    ).catch(()=>{
      notify("Something went wrong");
    })
  }
  return ( 
    <Dialog.Root open={modalData.isOpen} onOpenChange={()=>dispatch(setSignupModal({isOpen:!modalData.isOpen,data:null}))}>
    <Dialog.Trigger/>            
    <Dialog.Portal >
      <Dialog.Overlay/>
      <Dialog.Content className="fixed left-[50%] bg-white top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg sm:rounded-lg">
          <h1 className='text-3xl py-4 font-serif text-center'>Join us Today</h1>
        <div>  
          <h2 className="m-auto text-md text-center w-64 mb-4">
              Enter your username and email address to create an account.
          </h2>
          <form className='my-8' onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="name" className="block text-sm w-fit m-auto">Username</label>
                <input id="name" {...register("name")} className="block m-auto py-1/2 my-2 border-b-[1px] border-b-gray-700 w-64 outline-none text-center"></input>
                {errors?.name && 
                  <p className="block m-auto text-sm text-red-700 text-center mb-4">{errors?.name?.message}</p>
                } 
                <label htmlFor="email" className="block text-sm w-fit m-auto">Your email</label>
                <input id="email" {...register("email")} className="block m-auto py-1/2 my-2 border-b-[1px] border-b-gray-700 w-64 outline-none text-center"></input>
                {errors?.email && 
                  <p className="block m-auto text-sm text-red-700 text-center mb-4">{errors?.email?.message}</p>
                } 
                <button type="submit" className="block mx-auto whitespace-nowrap bg-black text-white rounded-full px-4 hover:bg-opacity-80 py-2">
                    Sign Up
                </button>
            </form>
            <div className='relative w-full flex items-center gap-2 my-4 opacity-20 text-black font-bold'>
                <hr className='w-1/2 border-black'/>
                <p>OR</p>
                <hr className='w-1/2 border-black'/>
            </div>
            <button onClick={()=>handleGoogleAuth()} className="mx-auto whitespace-nowrap border-[1px] border-black text-black rounded-full px-10 hover:bg-opacity-80 py-2 gap-2 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className='h-6 w-6' viewBox="0 0 48 48">
                <path fill="#fbc02d" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#e53935" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4caf50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1565c0" d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                </svg>
                Continue with Google
            </button>
            <div className="mt-6 text-gray-500 text-md text-center">
                Already have an account?
                <span  className="text-green-700 font-medium ml-1 cursor-pointer"onClick={()=>{dispatch(setSignupModal({isOpen:false,data:null})); dispatch(setSigninModal({isOpen:true,data:null}))}} >Sign in</span>
            </div>
        </div>
        <Dialog.Close><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
  )
}

export default SignupModal
