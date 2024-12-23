import express, { urlencoded } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
dotenv.config()
const app = express()

app.use(express.json())
app.use(urlencoded({ extended: true }))
app.use(cors())
app.use(cookieParser())

import userRouter from './routes/user.routes'
import courseRouter from './routes/course.routes'
import lessonRouter from './routes/lesson.routes'
import progressRouter from './routes/progress.routes'

app.use('/api/users', userRouter)
app.use('/api/courses', courseRouter)
app.use('/api/lessons', lessonRouter)
app.use('/api/progress', progressRouter)

export default app
