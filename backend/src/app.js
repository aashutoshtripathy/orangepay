import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";



const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    Credential: true
}))

app.use(express.json({limit:"16kb"}))

app.use(express.urlencoded({extended: true, limit: "16kb"}))
// app.use(express.static())
app.use(cookieParser())
app.use(bodyParser.json())



import userRouter from "./routes/user.routes.js"
import bodyParser from "body-parser";


app.use("/api/v1/users", userRouter)


export { app };