import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDoc from "../swagger/swagger-output.json";
import { errorHandler } from "./middlewares/error.middleware";
import authRouter from "./routes/auth.route";
import followRouter from "./routes/follow.route";
import likeRouter from "./routes/like.route";
import replyRouter from "./routes/reply.route";
import rootRouter from "./routes/root.route";
import threadRouter from "./routes/thread.route";
import userRouter from "./routes/user.route";
import profileRouter from "./routes/profile.route";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:4173",
      "https://b59-circle.vercel.app",
    ],
  })
);
app.use(express.json());
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDoc, {
    customSiteTitle: "Circle App API",
    customfavIcon: "NONE",
    isExplorer: true,
    customJs:
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js",
    customCssUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css",
    customCss: `
              .swagger-ui .topbar { display: none } 
              .information-container.wrapper { background:rgb(0, 255, 60); padding: 2rem } 
              .information-container .info { margin: 0 } 
              .information-container .info .main { margin: 0 !important} 
              .information-container .info .main .title { color:rgb(0, 0, 0)} 
              .renderedMarkdown p { margin: 0 !important; color:rgb(0, 0, 0) !important }
              `,
    swaggerOptions: {
      persistAuthorization: true,
    },
  })
);

app.use(rootRouter);
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/threads", threadRouter);
app.use("/likes", likeRouter);
app.use("/replies", replyRouter);
app.use("/follows", followRouter);
app.use("/profile", profileRouter);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`🟢 Server is Running at http://localhost:${port}`);
});
