const router = require('express').Router();
const { userLogin, userSignup,checkAuthLink, tokenRefresh, userLogout, authWithGoogle } = require('../controllers/auth.controller');
const {loginValidation, signupValidation} = require('../validations/user.validation');

router.post('/signin',loginValidation,userLogin);
router.post('/signup',signupValidation,userSignup);
router.post('/check',checkAuthLink);
router.post('/refresh',tokenRefresh);
router.post("/logout",userLogout);
router.post("/authwGoogle",authWithGoogle);

module.exports = router;