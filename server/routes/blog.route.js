const router = require("express").Router();
const { blogValidation } = require("../validations/blog.validation");
const {createBlog,searchBlogs, searchBlogsbyUser,getBlog, editBlog, likeBlog, unlikeBlog, getSuggestedBlog, deleteBlog,getPopularBlog, recentlyViewed} = require("./../controllers/blog.controller");
const {isAuthenticated,checkUser} = require("./../middlewares/auth.middleware");

router.post("/create",isAuthenticated,blogValidation,createBlog);
router.get("/",searchBlogs);
router.get("/popular",getPopularBlog);
router.get("/recent",isAuthenticated,recentlyViewed);
router.get("/u/:user",searchBlogsbyUser)
router.get("/:slug",checkUser,getBlog)
router.post("/:blogSlug/edit",isAuthenticated,blogValidation,editBlog);
router.post("/:blog/like",isAuthenticated,likeBlog);
router.post("/:blog/unlike",isAuthenticated,unlikeBlog);
router.get("/:slug/suggested",getSuggestedBlog);
router.post("/:slug/delete",isAuthenticated,deleteBlog);

module.exports = router;