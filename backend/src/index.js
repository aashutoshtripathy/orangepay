import dotenv from "dotenv"
import ConnectDB from "./db/index.js"
import { app } from "./app.js"

dotenv.config({
    path: './.env'
})

ConnectDB()
.then(() => {
    app.listen(process.env.PORT,() => {
        console.log(`server is running at port : ${process.env.PORT}`)
    })
})
.catch((error) => {
    console.log('Mongo DB connection failed',error)
})