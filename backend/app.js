import express from "express";
import cookieParser from "cookie-parser";
import { passport } from "./passport.config.js";
import apiRouter from "./routes/apiRouter.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(passport.initialize());

app.use("/api", apiRouter);

const PORT = process.env.BACKEND_PORT || 3000;
app.listen(PORT, () => console.log(`Express server is up and listening on port ${PORT}!`));