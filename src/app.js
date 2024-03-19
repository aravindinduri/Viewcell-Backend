import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";


const app = express();

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials :true,
}));

app.get('/',(req,res)=>{
let path = '/home/aravind/Desktop/Codes/web_devlopment/Backend/Video_con_project/frontend/index.html'
  res.sendFile(path);
})

app.use(express.json({limit :"20kb"}));
app.use(express.urlencoded({extended : true}));
app.use(express.static("public"));
app.use(cookieParser());

//routes
import UserRouter from "./routes/user.routes.js"
import VideoRouter from "./routes/video.routes.js"
import CommentRouter from "./routes/comment.routes.js"
import LikeRouter from "./routes/like.routes.js"
import tweetRouter from "./routes/tweet.routes.js"
import subcriptionRouter from './routes/subcription.routes.js'
import playlistRouter from "./routes/playlist.routes.js"
import healthRouter from "./routes/health.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"
//routes declaration.
app.use("/api/v1/users/",UserRouter);
app.use("/api/v1/videos/",VideoRouter);
app.use("/api/v1/comments/",CommentRouter);
app.use("/api/v1/likes/",LikeRouter);
app.use("/api/v1/tweets/",tweetRouter);
app.use("/api/v1/subcription/",subcriptionRouter);
app.use("/api/v1/playlist/",playlistRouter);
app.use("/api/v1/health/",healthRouter);
app.use("/api/v1/dashboard/",dashboardRouter);

export default app;