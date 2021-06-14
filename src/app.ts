import express from "express";
import corsMiddleware from "./middlewares/cors.middleware";
import authenticationRouter from "./routers/authentication.router";
import profileRouter from "./routers/profile.router";
import tokenRouter from "./routers/token.router";
import postRouter from "./routers/post.router";

const app = express();
const PORT = 5000 || process.env.PORT;

app.use(corsMiddleware());
// app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => res.send(req.query));

// Routers
app.use("/api/v1/authentication", authenticationRouter);
app.use("/api/v1/profile", profileRouter);
app.use("/api/v1/token", tokenRouter);
app.use("/api/v1/posts", postRouter);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
