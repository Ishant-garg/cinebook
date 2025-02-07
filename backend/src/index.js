import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import { connectDB } from './lib/db.js'
import authRoute from './routes/authRoute.js'
import movieRoute from './routes/movieRoute.js'
import theaterRoute from './routes/theaterRoute.js'
import showRoute from './routes/showRoute.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { getTheatersByDateAndMovie } from './controllers/theater.controllers.js'
const app = express()
app.use(cookieParser());

const port = process.env.PORT || 3000
const allowedOrigins = [
  "http://localhost:8080"  ,
  "http://localhost:5173" ,
  "https://cinebook-git-main-ishantgargs-projects.vercel.app/",
  "https://cinebook-blond.vercel.app/",
  process.env.CLIENT_URL,
  process.env.DASHBOARD_URL

];

app.use(
  cors({
    origin: (origin, callback) => {
      
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,  
  })
);
 // Allows all origins (use with caution)
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use("/api/auth" , authRoute ); 
app.use("/api/movie" , movieRoute ); 
app.use("/api/theater" , theaterRoute );
app.use("/api" , showRoute);
app.get("/api/theaters" , getTheatersByDateAndMovie)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
  connectDB();
})
