import ErrorModal from "../components/ErrorModal";
import SigninModal from "../components/SigninModal"
import SignupModal from "../components/SignupModal"
import SuccessModal from "../components/SuccessModal";
import {useSelector} from "react-redux";
import { Toaster } from 'react-hot-toast';
import EmailModal from "../components/EmailModal";
import UsernameModal from "../components/ChangeUsernameModal";
import UpdateProfileModal from "../components/UpdateProfileModal";
import CommentModal from "../components/CommentModal";

// eslint-disable-next-line react/prop-types
const ModalLayout = ({children}) => {
    const modal = useSelector(state=>state.modal);
  return (
    <>
        {children}
        {modal.signinModal.isOpen && <SigninModal/>}
        {modal.signupModal.isOpen && <SignupModal/>}
        {modal.successModal.isOpen && <SuccessModal/>}
        {modal.errorModal.isOpen && <ErrorModal/>}
        {modal.emailModal.isOpen && <EmailModal/>}
        {modal.usernameModal.isOpen && <UsernameModal/>}
        {modal.updateprofileModal.isOpen && <UpdateProfileModal/>}
        {modal.commentModal.isOpen && <CommentModal/>}
        <Toaster position="top-center" reverseOrder={false}/>
    </>
  )
}

export default ModalLayout