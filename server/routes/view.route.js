const router = require("express").Router();
const {checkUser} = require("./../middlewares/auth.middleware");
const {addView} = require("./../controllers/view.controller");

router.post("/",checkUser,addView);

module.exports = router;