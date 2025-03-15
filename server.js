import express from "express";
import path from 'path'
import { fileURLToPath } from 'url'
import MongoStore from 'connect-mongo'
import expressLayouts from 'express-ejs-layouts'

// import config modules
import connectDB from "./config/database.js";

//importing routes
import userRouter from './routes/user/index.js'


const app = express()

//fix __dirname && __filename for module
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

//set view engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.set('layout', 'layouts/user-layout')

app.use(expressLayouts) // Use express-ejs-layouts

//serve static files (images, js, CSS)
app.use(express.static(path.join(__dirname, 'public')))

//router
app.use('/', userRouter)
// app.use('/admin', adminRouter)



// connect db
connectDB()

//start the server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`server running on ${PORT}`))