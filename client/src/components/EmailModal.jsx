import * as Dialog from "@radix-ui/react-dialog";
import {useSelector,useDispatch} from "react-redux"
import {setEmailModal} from "../slice/modalSlice";
import {z} from "zod";
import { useForm } from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod"
import { customAxios } from "../utils/axios";
import notify from "react-hot-toast";

const schema = z.object({
    email:z.string().min(1,{message:"Email is required"}).email({message:"Please enter a valid email address"}),
  })
const EmailModal = () => {
      // eslint-disable-next-line react/prop-types
        const {register,handleSubmit,formState:{errors}} = useForm({resolver:zodResolver(schema)});
        const dispatch = useDispatch();
        const modalData = useSelector(state=>state.modal.emailModal);
        const onSubmit =(data)=>{
            customAxios.post("/user/update/email",data).then(()=>{
                dispatch(setEmailModal({isOpen:!modalData.isOpen,data:null}));
                notify("Please Check your New Email for verification.")
            }).catch(()=>{
                notify("Something went wrong.");
            })
        }
        return ( 
          <Dialog.Root open={modalData.isOpen} onOpenChange={()=>dispatch(setEmailModal({isOpen:!modalData.isOpen,data:null}))}>
          <Dialog.Portal>
            <Dialog.Overlay/>
            <Dialog.Content className="fixed left-[50%] bg-white top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg sm:rounded-lg">
              <h1 className='text-3xl py-4 font-serif text-center'>Email address</h1>
              <p className="text-center text-md w-64 mx-auto">You will receive a confirmation mail to your new Email address.</p>
              <div>
                <form className='my-8' onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="email" className="block text-sm w-fit m-auto">Your email</label>
                <input id="email" {...register("email")} defaultValue={modalData.data || ""} className="block m-auto py-1/2 my-2 border-b-[1px] border-b-gray-700 w-64 outline-none text-center"></input>
                {errors?.email && 
                    <p className="block m-auto text-sm text-red-700 text-center mb-4">{errors?.email?.message}</p>
                }
                <div className="flex mx-auto gap-2 w-fit">
                    <button type="submit" className="block mx-auto whitespace-nowrap bg-black text-white rounded-full px-4 hover:bg-opacity-80 py-2">
                        Confirm
                    </button>
                    <button onClick={()=>dispatch(setEmailModal({isOpen:!modalData.isOpen,data:null}))} className="block mx-auto whitespace-nowrap text-black bg-white rounded-full px-4 hover:bg-opacity-80 py-2">
                        Cancel
                    </button>
                </div>
                </form>
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

export default EmailModal