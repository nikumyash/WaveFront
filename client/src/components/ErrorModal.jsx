import * as Dialog from '@radix-ui/react-dialog';
import {useSelector,useDispatch} from "react-redux";
import { setErrorModal } from '../slice/modalSlice';

const ErrorModal = () => {
  const dispatch = useDispatch();
  const error = useSelector(state=>state.modal.errorModal);
  return (
    <>
    <Dialog.Root open={error.isOpen} onOpenChange={()=>dispatch(setErrorModal({isOpen:!error.isOpen,error:null}))}>
        <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content className="fixed bg-white left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg sm:rounded-lg">
            <h1 className='text-3xl py-4 font-serif text-center'>{error.error.title}</h1>
            <h2 className="m-auto text-md text-center w-64 mb-4">
                {error.error.desc}
            </h2>
            <button onClick={()=>dispatch(setErrorModal({isOpen:!error.isOpen,error:null}))} className="block mx-auto whitespace-nowrap bg-black text-white rounded-full px-4 hover:bg-opacity-80 py-2">
                  Ok
            </button>
            <Dialog.Close />
        </Dialog.Content>
        </Dialog.Portal>
    </Dialog.Root>
    </>
  )
}

export default ErrorModal