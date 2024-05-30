import express from "express";
import cors from "cors";
import cookieparser from "cookie-parser";
const app = express();

app.use(
  cors({
    origin: process.env.ORIGIN,
    Credential: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieparser());

//routes imports
import userRouter from "./routes/user.routes.js";

//route declaration
app.use("/api/v1/user", userRouter);

export { app };
