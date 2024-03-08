const express = require("express");
require('dotenv').config();
const dbConnect = require('./config/dbconfig');
const { sendLoginMail, transporter } = require("./services/mail.service.js");
const authRouter = require('./routes/auth.route.js');
const blogRouter = require("./routes/blog.route");
const userRouter = require("./routes/user.router.js");
const topicRouter = require("./routes/topic.route.js");
const commentRouter = require("./routes/comment.route.js");
const viewRouter = require("./routes/view.route.js");
const cors = require('cors');
const cookieParser = require('cookie-parser');
const {_getSignedUrl} = require("./util/generateSignedUrl.js");
const { isAuthenticated } = require("./middlewares/auth.middleware.js");
const serviceAccount = require(process.env.FIREBASECONFIGFILE);
const admin = require("firebase-admin");

dbConnect();
const app = express();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

app.use(cors({origin:"http://localhost:5173",methods:['GET', 'PUT', 'POST','DELETE'],credentials:true}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.use('/auth',authRouter);
app.use('/blog',blogRouter);
app.use('/user',userRouter);
app.use("/topic",topicRouter);
app.use("/comment",commentRouter);
app.use("/view",viewRouter);
app.get('/uploadImage',isAuthenticated,_getSignedUrl);
app.use('*',(req,res)=>{
    res.status(404).json({success:false,error:"Page not found"})
})

app.listen(process.env.PORT || 6969,()=>{
    console.log("Listening to port no",process.env.PORT);
})