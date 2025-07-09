"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const error_middleware_1 = require("./middlewares/error.middleware");
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const follow_route_1 = __importDefault(require("./routes/follow.route"));
const like_route_1 = __importDefault(require("./routes/like.route"));
const post_route_1 = __importDefault(require("./routes/post.route"));
const profile_route_1 = __importDefault(require("./routes/profile.route"));
const reply_route_1 = __importDefault(require("./routes/reply.route"));
const root_route_1 = __importDefault(require("./routes/root.route"));
const user_route_1 = __importDefault(require("./routes/user.route"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:5173",
        "http://localhost:5173/circle",
        "https://circle-app-fe-x1wr.vercel.app",
    ],
    credentials: true,
}));
app.use(express_1.default.json());
app.use("/circle", root_route_1.default);
app.use("/circle/auth", auth_route_1.default);
app.use("/circle/users", user_route_1.default);
app.use("/circle/posts", post_route_1.default);
app.use("/circle/likes", like_route_1.default);
app.use("/circle/replies", reply_route_1.default);
app.use("/circle/follows", follow_route_1.default);
app.use("/circle/profiles", profile_route_1.default);
app.use(error_middleware_1.errorHandler);
app.listen(port, () => {
    console.log(`🚀 Server is Running at http://localhost:${port}/circle`);
});
