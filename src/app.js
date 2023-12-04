import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    Credential: true
}))
app.use(express.json({ limit: "10kb" }))
app.use(express.urlencoded({ extended: true, limit: "10kb" }))
app.use(express.static("public"))
app.use(cookieParser())


//routes imports
import userRouter from './routes/user.routes.js';
import appStoreRouter from './routes/appstore.routes.js'

// routes declaration
app.use('/api/v1/users', userRouter)
app.use('/api/v1/appstore', appStoreRouter)

export { app }