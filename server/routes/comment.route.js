const router = require('express').Router();
const { newComment, getComments, deleteComments } = require('../controllers/comment.controller');
const {isAuthenticated, checkUser} = require("./../middlewares/auth.middleware");

router.post('/new',isAuthenticated,newComment);
router.get("/",checkUser,getComments);
router.post("/delete",isAuthenticated,deleteComments);

module.exports = router;