const router = require("express").Router();
const {followTopic,unfollowTopic, getTopTopics, getTopic, searchTopic} = require("../controllers/topic.controller")
const {isAuthenticated, checkUser} = require("./../middlewares/auth.middleware")

router.post("/:slug/follow",isAuthenticated,followTopic)
router.post("/:slug/unfollow",isAuthenticated,unfollowTopic)
router.get("/top",checkUser,getTopTopics);
router.get("/:slug",checkUser,getTopic);
router.get("/",searchTopic);
module.exports = router;