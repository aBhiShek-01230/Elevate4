import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()



app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())




import userRouter from "./routes/user.routes.js"
import teacherRouter from "./routes/teacher.routes.js"
import courseRouter from "./routes/course.routes.js"
import labRouter from "./routes/lab.routes.js"
import quizRouter from "./routes/quiz.routes.js"
import adminRouter from "./routes/admin.routes.js"
import globalRouter from "./routes/global.routes.js"
import chatRouter from "./routes/chat.routes.js"
import practiceRouter from "./routes/practice.routes.js"
import messageRouter from "./routes/message.routes.js"



app.use("/api/v1/users",userRouter)
app.use("/api/v1/teachers",teacherRouter)
app.use("/api/v1/courses",courseRouter)
app.use("/api/v1/admin",labRouter)
app.use("/api/v1/admin",adminRouter)
app.use("/api/v1/global",globalRouter)
app.use("/api/v1/chat",chatRouter)
app.use("/api/v1/practice",practiceRouter)
app.use("/api/v1/message",messageRouter)


export { app }

