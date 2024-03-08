import * as Dialog from '@radix-ui/react-dialog';
import {useSelector,useDispatch} from "react-redux";
import { setSuccessModal } from '../slice/modalSlice';

const SuccessModal = () => {
  const dispatch = useDispatch();
  const data = useSelector(state=>state.modal.successModal);
  return (
    <>
    <Dialog.Root open={data.isOpen} onOpenChange={()=>dispatch(dispatch(setSuccessModal({isOpen:!data.isOpen,data:null})))}>
        <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content className="fixed bg-white left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg sm:rounded-lg">
            <h1 className='text-3xl py-4 font-serif text-center'>Check the Inbox</h1>
            <h2 className="m-auto text-md text-center w-64 mb-4">
                Click the link we sent to {data.data} sign in.
            </h2>
            <button onClick={()=>dispatch(dispatch(setSuccessModal({isOpen:!data.isOpen,data:null})))} className="block mx-auto whitespace-nowrap bg-black text-white rounded-full px-4 hover:bg-opacity-80 py-2">
                  Ok
            </button>
            <Dialog.Close />
        </Dialog.Content>
        </Dialog.Portal>
    </Dialog.Root>
    </>
  )
}

export default SuccessModal