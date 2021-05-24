import express from "express";
import corsMiddleware from "./middlewares/cors.middleware";
import authentication from "./routers/authentication.router";

const app = express();
const PORT = 5000 || process.env.PORT;

app.use(corsMiddleware());
// app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => res.send("Nothing special here"));

// Routers
app.use("/api/authentication", authentication);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
