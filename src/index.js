// require('dotenv').config({path : './env'})
import dotenv from 'dotenv';
import connectDB from "./db/db.js";
import { app } from './app.js'

dotenv.config({
    path: './env'
})

connectDB()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`server is listning on port : ${process.env.PORT}`)
        })
    })
    .catch((err) => {
        console.log('MONGODB connection failed', err);
    })
