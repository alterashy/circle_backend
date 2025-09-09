import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { errorHandler } from "./middlewares/error.middleware";
import authRouter from "./routes/auth.route";
import followRouter from "./routes/follow.route";
import likeRouter from "./routes/like.route";
import postRouter from "./routes/post.route";
import profileRouter from "./routes/profile.route";
import replyRouter from "./routes/reply.route";
import rootRouter from "./routes/root.route";
import userRouter from "./routes/user.route";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(
  "*", cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5173/circle",
      "https://circle-app-fe-x1wr.vercel.app",
      "https://circle-app-fe-x1wr.vercel.app/",
    ],
    credentials: true
  })
);

app.use(express.json());

app.use("/circle", rootRouter);
app.use("/circle/auth", authRouter);
app.use("/circle/users", userRouter);
app.use("/circle/posts", postRouter);
app.use("/circle/likes", likeRouter);
app.use("/circle/replies", replyRouter);
app.use("/circle/follows", followRouter);
app.use("/circle/profiles", profileRouter);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`🚀 Server is Running at http://localhost:${port}/circle`);
});
