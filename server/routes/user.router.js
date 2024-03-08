const router =require("express").Router();
const { getUser, changeUserName, generateUserEmailToken, checkMailToken, changeUserProfileInfo, searchUser, followUser, unFollowUser } = require("../controllers/user.controller");
const {checkUser, isAuthenticated} = require("../middlewares/auth.middleware");

router.get("/:user",checkUser,getUser);
router.post("/update/username",isAuthenticated,changeUserName);
router.post("/update/email",isAuthenticated,generateUserEmailToken);
router.post("/update/email/check",checkMailToken);
router.post("/update/profile",isAuthenticated,changeUserProfileInfo);
router.get("/",searchUser);
router.post("/:slug/follow",isAuthenticated,followUser);
router.post("/:slug/unfollow",isAuthenticated,unFollowUser);

module.exports = router;